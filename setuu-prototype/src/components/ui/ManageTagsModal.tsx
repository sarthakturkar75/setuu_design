"use client";
import React, { useState, useEffect } from 'react';
import { X, Plus, Tags } from 'lucide-react';
import { getCompanyTags, createCompanyTag } from "@/app/actions/teamActions";
import { useToast } from "@/contexts/ToastContext";

export function ManageTagsModal({ onClose }: any) {
  const [tags, setTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const fetchTags = async () => {
    setLoading(true);
    const res = await getCompanyTags();
    if (res.success) {
      setTags(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setIsSubmitting(true);
    
    const fd = new FormData();
    fd.append('name', newTagName);
    
    const res = await createCompanyTag(fd);
    setIsSubmitting(false);
    
    if (res.success) {
      toast.success(`Tag "${newTagName}" created!`);
      setNewTagName("");
      fetchTags();
    } else {
      toast.error(res.error || "Failed to create tag. It might already exist.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/30 max-h-[80vh]">
        
        <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface shrink-0">
          <div>
            <h2 className="text-xl font-bold text-on-surface font-merriweather flex items-center gap-2">
              <Tags className="w-5 h-5 text-primary" /> Manage Company Tags
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">Create global skill tags for personnel.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <form onSubmit={handleCreate} className="flex gap-2">
            <input 
              type="text"
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
              placeholder="e.g. Certified Crane Operator"
              className="flex-1 p-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:border-primary outline-none"
            />
            <button 
              disabled={isSubmitting || !newTagName.trim()} 
              type="submit" 
              className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create
            </button>
          </form>

          <div>
            <h3 className="text-sm font-semibold text-on-surface mb-3">Existing Dictionary</h3>
            {loading ? (
              <div className="text-sm text-on-surface-variant animate-pulse">Loading dictionary...</div>
            ) : tags.length === 0 ? (
              <div className="text-sm text-on-surface-variant italic">No tags exist yet.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-surface-variant text-on-surface rounded-lg text-xs font-semibold border border-outline-variant/50 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
