"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from "@/contexts/ToastContext";
import { createChangeRequest } from "@/app/actions/changeOrderActions";

export function SubmitChangeRequestModal({ projectId, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rawCost: '',
    timeImpact: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createChangeRequest(
        projectId, 
        parseFloat(formData.rawCost) || 0,
        formData.title,
        formData.description,
        parseInt(formData.timeImpact) || 0
      );
      if (res.success) {
        toast.success("Change request submitted. Markup automatically applied.");
        onRefresh();
      } else {
        toast.error(res.error || "Failed to submit.");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-lg rounded-xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/30">
        
        <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface-container-lowest">
          <h2 className="text-xl font-bold text-on-surface font-merriweather">Log Variation Order</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-on-surface">Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 w-full p-2 rounded bg-surface border border-outline-variant text-sm text-on-surface" placeholder="e.g. Added electrical outlets" />
          </div>
          <div>
            <label className="text-sm font-semibold text-on-surface">Description</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 w-full p-2 rounded bg-surface border border-outline-variant text-sm text-on-surface" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-on-surface">Raw Cost ($)</label>
              <input required type="number" step="0.01" value={formData.rawCost} onChange={e => setFormData({...formData, rawCost: e.target.value})} className="mt-1 w-full p-2 rounded bg-surface border border-outline-variant text-sm text-on-surface" placeholder="e.g. 5000" />
              <div className="text-[10px] text-on-surface-variant mt-1">+15% OH & +5% P auto-applied</div>
            </div>
            <div>
              <label className="text-sm font-semibold text-on-surface">Time Impact (Days)</label>
              <input required type="number" value={formData.timeImpact} onChange={e => setFormData({...formData, timeImpact: e.target.value})} className="mt-1 w-full p-2 rounded bg-surface border border-outline-variant text-sm text-on-surface" placeholder="e.g. 2" />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
             <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-variant rounded transition-colors">Cancel</button>
             <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-primary text-on-primary font-semibold rounded hover:bg-primary/90 transition-colors">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
