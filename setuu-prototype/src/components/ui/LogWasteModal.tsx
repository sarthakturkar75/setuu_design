"use client";

import React, { useState } from 'react';
import { X, Trash } from 'lucide-react';
import { useToast } from "@/contexts/ToastContext";
import { logMaterialWaste } from "@/app/actions/materialActions";

export function LogWasteModal({ material, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    qty: '',
    unitCost: '',
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await logMaterialWaste(
        material.id, 
        parseFloat(formData.qty), 
        formData.reason, 
        parseFloat(formData.unitCost)
      );
      if (res.success) {
        toast.success("Waste logged and financial loss calculated.");
        onRefresh();
      } else {
        toast.error(res.error || "Failed to log waste.");
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
        
        <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-semantic-crimson-bg/10">
          <h2 className="text-lg font-bold text-semantic-crimson flex items-center gap-2">
            <Trash className="w-5 h-5" /> Log Waste/Damage
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full text-semantic-crimson"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
             <p className="text-sm font-semibold text-on-surface">{material.item_name}</p>
             <p className="text-xs text-on-surface-variant">Available: {material.quantity}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-on-surface">Qty Wasted</label>
              <input required type="number" step="0.1" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} className="mt-1 w-full p-2 rounded bg-surface border border-outline-variant text-sm text-on-surface" placeholder="e.g. 5" />
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface">Unit Cost ($)</label>
              <input required type="number" step="0.01" value={formData.unitCost} onChange={e => setFormData({...formData, unitCost: e.target.value})} className="mt-1 w-full p-2 rounded bg-surface border border-outline-variant text-sm text-on-surface" placeholder="e.g. 150" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface">Reason / Incident Description</label>
            <textarea required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="mt-1 w-full p-2 rounded bg-surface border border-outline-variant text-sm text-on-surface" rows={3} placeholder="e.g. Damaged during unloading..." />
          </div>
          <div className="mt-2 p-3 bg-surface-variant/30 rounded text-sm flex justify-between items-center border border-outline-variant/50">
             <span className="font-semibold text-on-surface-variant">Estimated Loss:</span>
             <span className="font-mono font-bold text-semantic-crimson">${(parseFloat(formData.qty || '0') * parseFloat(formData.unitCost || '0')).toLocaleString()}</span>
          </div>
          <div className="mt-2 flex justify-end gap-3">
             <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-variant rounded transition-colors">Cancel</button>
             <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-semantic-crimson text-white font-semibold rounded hover:bg-semantic-crimson/90 transition-colors">Submit Log</button>
          </div>
        </form>
      </div>
    </div>
  );
}
