"use client";

import React, { useState } from 'react';
import { X, BoxSelect, FileText } from 'lucide-react';
import { simulateSlipSheeting } from "@/app/actions/drawingActions";
import { useToast } from "@/contexts/ToastContext";

export function AutoSlipSheetModal({ projectId, onClose, onSuccess }: { projectId: string, onClose: () => void, onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsProcessing(true);
    setStatus("Initializing PDF Engine...");
    
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const parsedPages = [];

      setStatus(`Extracting ${pdf.numPages} sheets...`);

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(Math.round((i / pdf.numPages) * 100));
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: context!, viewport } as any).promise;
        const base64Payload = canvas.toDataURL('image/jpeg', 0.8);

        parsedPages.push({
          extractedTitleBlockName: `${file.name.replace('.pdf', '')} - Sheet ${i}`, // Simulated OCR Title Block
          base64Payload
        });
      }

      setStatus("Saving discrete sheets to database...");
      const res = await simulateSlipSheeting(projectId, parsedPages);
      
      if (res.success) {
         toast.success(`Slip-Sheeting complete: ${pdf.numPages} sheets extracted!`);
         onSuccess();
      } else {
         toast.error(`Slip-Sheeting failed: ${res.error}`);
         setIsProcessing(false);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Engine error: ${err.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col border border-outline-variant/50">
        <div className="flex justify-between items-center p-4 border-b border-outline-variant/50 bg-surface-container-lowest">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <BoxSelect className="w-5 h-5 text-primary" /> Auto-Slip Sheet PDF
          </h2>
          <button onClick={onClose} disabled={isProcessing} className="p-1 hover:bg-surface-variant rounded text-on-surface-variant transition-colors disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleProcess} className="p-6 flex flex-col gap-4">
          <p className="text-sm text-on-surface-variant mb-2">Upload a multi-page Master PDF. The engine will rip it apart, extract the individual sheets, and catalog them automatically.</p>
          
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Master PDF File</label>
            <div className="relative border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center hover:bg-surface-variant/30 transition-colors cursor-pointer">
               <input required type="file" disabled={isProcessing} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" accept="application/pdf" onChange={handleFileChange} />
               <FileText className="w-8 h-8 text-on-surface-variant mb-2" />
               <span className="text-sm font-semibold text-on-surface text-center px-4">{file ? file.name : "Click or drag to select multi-page PDF"}</span>
            </div>
          </div>

          {isProcessing && (
            <div className="mt-4 p-4 bg-surface-container rounded-lg border border-outline-variant/50 flex flex-col gap-2">
               <div className="flex justify-between text-xs font-bold text-on-surface">
                 <span>{status}</span>
                 <span>{progress}%</span>
               </div>
               <div className="w-full bg-outline-variant/50 h-2 rounded-full overflow-hidden">
                 <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
               </div>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isProcessing} className="px-4 py-2 font-bold text-sm text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={isProcessing || !file} className="px-6 py-2 bg-primary text-on-primary font-bold text-sm rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50">
              {isProcessing ? "Extracting..." : "Run Extraction Engine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
