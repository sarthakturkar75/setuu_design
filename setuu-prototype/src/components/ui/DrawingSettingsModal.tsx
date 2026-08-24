"use client";

import React, { useState } from 'react';
import { X, Trash2, Edit2, FileImage, Tag, Plus, XCircle } from 'lucide-react';
import { deleteDrawingVersion, renameDrawingGroup, replaceDrawingFile, updateDrawingTags } from "@/app/actions/drawingActions";
import { useToast } from "@/contexts/ToastContext";

export function DrawingSettingsModal({ drawing, allVersionsCount, onClose, onSuccess }: { drawing: any, allVersionsCount: number, onClose: () => void, onSuccess: () => void }) {
  const [activeTab, setActiveTab] = useState<'rename' | 'replace' | 'tags' | 'delete'>('rename');
  
  // State for Rename
  const [newName, setNewName] = useState(drawing.drawing_name);
  
  // State for Tags
  const initialTags = drawing.custom_data?.tags || [];
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTagInput, setNewTagInput] = useState('');

  // State for Replace
  const [replaceFile, setReplaceFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleRename = async () => {
    if (!newName.trim() || newName === drawing.drawing_name) return;
    setIsLoading(true);
    const res = await renameDrawingGroup(drawing.project_id, drawing.drawing_name, newName);
    if (res.success) {
      toast.success(`Renamed all ${allVersionsCount} revisions to ${newName}`);
      onSuccess();
    } else {
      toast.error(res.error || "Unknown error");
    }
    setIsLoading(false);
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter(tag => tag !== t));
  };

  const handleSaveTags = async () => {
    setIsLoading(true);
    const res = await updateDrawingTags(drawing.id, drawing.custom_data, tags);
    if (res.success) {
      toast.success("Tags updated successfully");
      onSuccess();
    } else {
      toast.error(res.error || "Unknown error");
    }
    setIsLoading(false);
  };

  const handleReplace = async () => {
    if (!replaceFile) return;
    setIsLoading(true);
    try {
      let base64Data = "";
      if (replaceFile.type === 'application/pdf') {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
        const arrayBuffer = await replaceFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context!, viewport } as any).promise;
        base64Data = canvas.toDataURL('image/jpeg', 0.8);
      } else {
        base64Data = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(replaceFile);
        });
      }

      const res = await replaceDrawingFile(drawing.id, base64Data);
      if (res.success) {
         toast.success("Blueprint file replaced successfully!");
         onSuccess();
      } else {
         toast.error(res.error || "Unknown error");
      }
    } catch (err: any) {
      toast.error(`Engine error: ${err.message}`);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete Revision v${drawing.version_number}?`)) return;
    setIsLoading(true);
    const res = await deleteDrawingVersion(drawing.id);
    if (res.success) {
      toast.success("Revision deleted!");
      onSuccess();
    } else {
      toast.error(res.error || "Unknown error");
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col border border-outline-variant/50">
        
        <div className="flex justify-between items-center p-4 border-b border-outline-variant/50 bg-surface-container-lowest">
          <h2 className="text-lg font-bold text-on-surface">Manage Blueprint</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-variant rounded text-on-surface-variant transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex text-xs font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/50 bg-surface-container-lowest">
          <button onClick={() => setActiveTab('rename')} className={`flex-1 p-3 text-center transition-colors ${activeTab === 'rename' ? 'bg-primary text-on-primary' : 'hover:bg-surface-variant'}`}>Rename</button>
          <button onClick={() => setActiveTab('tags')} className={`flex-1 p-3 text-center transition-colors ${activeTab === 'tags' ? 'bg-primary text-on-primary' : 'hover:bg-surface-variant'}`}>Tags</button>
          <button onClick={() => setActiveTab('replace')} className={`flex-1 p-3 text-center transition-colors ${activeTab === 'replace' ? 'bg-primary text-on-primary' : 'hover:bg-surface-variant'}`}>Replace</button>
          <button onClick={() => setActiveTab('delete')} className={`flex-1 p-3 text-center text-error transition-colors ${activeTab === 'delete' ? 'bg-error text-on-error' : 'hover:bg-error/10'}`}>Delete</button>
        </div>

        <div className="p-6">
          {activeTab === 'rename' && (
            <div className="space-y-4">
              <p className="text-sm text-on-surface-variant">Rename the entire drawing group. This updates the Sheet ID for all {allVersionsCount} revisions in this group.</p>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">NEW DRAWING NAME</label>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-2 rounded bg-surface border border-outline-variant text-sm focus:outline-none focus:border-primary" />
              </div>
              <button disabled={isLoading} onClick={handleRename} className="w-full py-2 bg-primary text-on-primary font-bold text-sm rounded hover:bg-primary/90 transition-colors">Rename Group</button>
            </div>
          )}

          {activeTab === 'tags' && (
            <div className="space-y-4">
              <p className="text-sm text-on-surface-variant">Assign tags to Revision v{drawing.version_number} (e.g. "Issued for Construction", "Urgent").</p>
              
              <div className="flex gap-2 flex-wrap">
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 bg-surface-variant text-on-surface text-xs font-bold px-2 py-1 rounded">
                    <Tag className="w-3 h-3" /> {t}
                    <button onClick={() => handleRemoveTag(t)} className="hover:text-error ml-1"><XCircle className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input type="text" value={newTagInput} onChange={e => setNewTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTag()} placeholder="New tag..." className="flex-1 p-2 rounded bg-surface border border-outline-variant text-sm focus:outline-none focus:border-primary" />
                <button onClick={handleAddTag} className="p-2 bg-surface-variant text-on-surface-variant rounded hover:bg-surface-variant/80"><Plus className="w-5 h-5" /></button>
              </div>

              <button disabled={isLoading} onClick={handleSaveTags} className="w-full py-2 bg-primary text-on-primary font-bold text-sm rounded hover:bg-primary/90 transition-colors mt-2">Save Tags</button>
            </div>
          )}

          {activeTab === 'replace' && (
            <div className="space-y-4">
              <p className="text-sm text-on-surface-variant">Replace the physical file for Revision v{drawing.version_number} without creating a new revision.</p>
              
              <div className="border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center cursor-pointer relative hover:bg-surface-variant/30">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*,application/pdf" onChange={e => setReplaceFile(e.target.files?.[0] || null)} />
                <FileImage className="w-8 h-8 text-on-surface-variant mb-2" />
                <span className="text-sm font-bold text-center">{replaceFile ? replaceFile.name : "Click to select replacement file"}</span>
              </div>

              <button disabled={isLoading || !replaceFile} onClick={handleReplace} className="w-full py-2 bg-primary text-on-primary font-bold text-sm rounded hover:bg-primary/90 transition-colors disabled:opacity-50">Replace File</button>
            </div>
          )}

          {activeTab === 'delete' && (
            <div className="space-y-4 text-center">
              <Trash2 className="w-12 h-12 text-error mx-auto mb-2" />
              <p className="text-sm font-bold text-on-surface">Danger Zone</p>
              <p className="text-sm text-on-surface-variant">This will permanently delete Revision v{drawing.version_number}. If this is the only revision, the entire drawing group will disappear.</p>
              
              <button disabled={isLoading} onClick={handleDelete} className="w-full py-2 bg-error text-on-error font-bold text-sm rounded hover:bg-error/90 transition-colors mt-4">PERMANENTLY DELETE</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
