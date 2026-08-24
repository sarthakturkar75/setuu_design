"use client";

import React, { useState } from 'react';
import { X, UploadCloud, FileImage } from 'lucide-react';
import { uploadDrawingVersion } from "@/app/actions/drawingActions";
import { useToast } from "@/contexts/ToastContext";

export function UploadDrawingModal({ projectId, onClose, onSuccess }: { projectId: string, onClose: () => void, onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [drawingName, setDrawingName] = useState("");
  const [discipline, setDiscipline] = useState("Architectural");
  const [isLoading, setIsLoading] = useState(false);
  
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!drawingName) {
        setDrawingName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const processFileToBase64 = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1); // Only grab page 1 for single uploads
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context!, viewport } as any).promise;
      return canvas.toDataURL('image/jpeg', 0.8);
    } else {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !drawingName) return;

    setIsLoading(true);
    
    try {
      const base64Data = await processFileToBase64(file);
      const fd = new FormData();
      fd.append("project_id", projectId);
      fd.append("drawing_name", drawingName);
      fd.append("discipline", discipline);
      fd.append("file_url", base64Data);
      
      const res = await uploadDrawingVersion(fd);
      if (res.success) {
         toast.success("Drawing successfully uploaded!");
         onSuccess();
      } else {
         toast.error(`Upload failed: ${res.error}`);
         setIsLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Engine error: ${err.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col border border-outline-variant/50">
        <div className="flex justify-between items-center p-4 border-b border-outline-variant/50 bg-surface-container-lowest">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-primary" /> Upload Blueprint
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-variant rounded text-on-surface-variant transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">File (Image/PDF)</label>
            <div className="relative border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center hover:bg-surface-variant/30 transition-colors cursor-pointer">
               <input required type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*,application/pdf" onChange={handleFileChange} />
               <FileImage className="w-8 h-8 text-on-surface-variant mb-2" />
               <span className="text-sm font-semibold text-on-surface">{file ? file.name : "Click or drag to select file"}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Drawing Name / Sheet ID</label>
            <input required type="text" value={drawingName} onChange={e => setDrawingName(e.target.value)} placeholder="e.g. A-101 Floor Plan" className="w-full p-2.5 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Discipline Layer</label>
            <select required value={discipline} onChange={e => setDiscipline(e.target.value)} className="w-full p-2.5 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
               <option value="Architectural">Architectural</option>
               <option value="Structural">Structural</option>
               <option value="Plumbing">Plumbing</option>
               <option value="Electrical">Electrical</option>
               <option value="Mechanical">Mechanical (HVAC)</option>
               <option value="Fire Protection">Fire Protection</option>
            </select>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 font-bold text-sm text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-primary text-on-primary font-bold text-sm rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50">
              {isLoading ? "Processing..." : "Upload Revision"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
