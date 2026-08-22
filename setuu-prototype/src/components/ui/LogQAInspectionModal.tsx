"use client";

import React, { useState } from 'react';
import { X, ClipboardCheck } from 'lucide-react';
import { useToast } from "@/contexts/ToastContext";
import { logQAInspection } from "@/app/actions/issueActions";

export function LogQAInspectionModal({ issue, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  const [checklist, setChecklist] = useState({
    structural_integrity: false,
    materials_approved: false,
    safety_compliant: false
  });
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...checklist, notes };
      const res = await logQAInspection(issue.id, payload);
      if (res.success) {
        toast.success("QA Inspection logged successfully.");
        onRefresh();
      } else {
        toast.error(res.error || "Failed to log QA.");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-sm rounded-xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/30">
        
        <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface-container-lowest">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" /> QA Inspection
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <p className="text-sm text-on-surface-variant mb-2">Issue: {issue.title}</p>
          
          <div className="space-y-3 bg-surface p-4 rounded-lg border border-outline-variant/50">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={checklist.structural_integrity} onChange={e => setChecklist({...checklist, structural_integrity: e.target.checked})} className="w-4 h-4 rounded text-primary" />
              <span className="text-sm font-semibold text-on-surface">Structural Integrity Verified</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={checklist.materials_approved} onChange={e => setChecklist({...checklist, materials_approved: e.target.checked})} className="w-4 h-4 rounded text-primary" />
              <span className="text-sm font-semibold text-on-surface">Approved Materials Used</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={checklist.safety_compliant} onChange={e => setChecklist({...checklist, safety_compliant: e.target.checked})} className="w-4 h-4 rounded text-primary" />
              <span className="text-sm font-semibold text-on-surface">Site Safety Compliant</span>
            </label>
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface">Inspector Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 w-full p-2 rounded bg-surface border border-outline-variant text-sm text-on-surface" rows={3} placeholder="Additional comments..." />
          </div>

          <div className="mt-2 flex justify-end gap-3">
             <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-variant rounded transition-colors">Cancel</button>
             <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-primary text-on-primary font-semibold rounded hover:bg-primary/90 transition-colors">Submit Pass</button>
          </div>
        </form>
      </div>
    </div>
  );
}
