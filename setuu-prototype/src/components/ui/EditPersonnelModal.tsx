"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { updatePersonnelProfile, getCompanyTags, createCompanyTag } from "@/app/actions/teamActions";
import { useToast } from "@/contexts/ToastContext";

export function EditPersonnelModal({ user, onClose, onRefresh }: any) {
  const [hourlyRate, setHourlyRate] = useState(user.hourly_rate || 0);
  const [employmentType, setEmploymentType] = useState(user.employment_type || "External Vendor");
  
  // Tagging system
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(user.skills || []));
  const [newTagName, setNewTagName] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTags, setLoadingTags] = useState(true);
  const toast = useToast();

  const fetchTags = async () => {
    const res = await getCompanyTags();
    if (res.success) {
      setAvailableTags(res.data);
    }
    setLoadingTags(false);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const toggleTag = (tag: string) => {
    const next = new Set(selectedTags);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setSelectedTags(next);
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setIsCreatingTag(true);
    
    const fd = new FormData();
    fd.append('name', newTagName);
    
    const res = await createCompanyTag(fd);
    setIsCreatingTag(false);
    
    if (res.success) {
      toast.success("New tag created!");
      setNewTagName("");
      fetchTags();
    } else {
      toast.error(res.error || "Failed to create tag. It might already exist.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const fd = new FormData();
    fd.append('user_id', user.id);
    fd.append('hourly_rate', hourlyRate.toString());
    fd.append('employment_type', employmentType);
    fd.append('skills', Array.from(selectedTags).join(','));

    const res = await updatePersonnelProfile(fd);
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Profile updated successfully!");
      onRefresh();
      onClose();
    } else {
      toast.error(res.error || "Failed to update profile.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/30 max-h-[90vh]">
        
        <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface shrink-0">
          <div>
            <h2 className="text-xl font-bold text-on-surface font-merriweather flex items-center gap-2">
              Edit Personnel Profile
            </h2>
            <p className="text-xs text-on-surface-variant font-mono mt-1">{user.display_name} ({user.role})</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface">Employment Type</label>
              <select 
                value={employmentType} 
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:border-primary outline-none"
              >
                <option value="Internal Employee">Internal Employee</option>
                <option value="External Vendor">External Vendor & Subcontractor</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface">Hourly Rate ($)</label>
              <input 
                type="number" 
                min="0"
                step="0.01"
                value={hourlyRate} 
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:border-primary outline-none"
              />
              <p className="text-[10px] text-on-surface-variant">Used to calculate real-time financial burn from turnstile logs.</p>
            </div>
          </form>

          {/* Tags Section */}
          <div className="border-t border-outline-variant/30 pt-5 space-y-3">
            <div className="flex justify-between items-center">
               <label className="text-sm font-medium text-on-surface">Skills & Tags</label>
               <span className="text-xs text-on-surface-variant">{selectedTags.size} selected</span>
            </div>
            
            {loadingTags ? (
              <div className="text-xs text-on-surface-variant animate-pulse">Loading company tags...</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    type="button"
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      selectedTags.has(tag) 
                        ? 'bg-primary text-on-primary border-primary' 
                        : 'bg-surface text-on-surface-variant border-outline-variant hover:border-primary/50 hover:bg-surface-variant/30'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            
          </div>
        </div>

        <div className="p-4 flex justify-end gap-3 border-t border-outline-variant/30 bg-surface shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-transparent text-on-surface-variant rounded-lg text-sm hover:bg-surface-variant">Cancel</button>
          <button form="profile-form" disabled={isSubmitting} type="submit" className="px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 flex items-center gap-2">
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4" /> Save Profile</>}
          </button>
        </div>

      </div>
    </div>
  );
}
