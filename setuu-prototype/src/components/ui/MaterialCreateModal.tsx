"use client";

import React, { useState } from 'react';
import { X, PackageSearch } from 'lucide-react';
import { useToast } from "@/contexts/ToastContext";
import { createMaterial, getProjectSubmittals } from "@/app/actions/materialActions";
import { useEffect } from "react";

export function MaterialCreateModal({ projectId, onClose, onRefresh }: any) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [submittals, setSubmittals] = useState<any[]>([]);

  useEffect(() => {
    getProjectSubmittals(projectId).then(setSubmittals);
  }, [projectId]);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    poNumber: '',
    submittalId: '',
    reorderThreshold: '',
    currentStock: '',
    unitCost: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append('project_id', projectId);
    fd.append('item_name', formData.itemName);
    fd.append('quantity', formData.quantity);
    fd.append('po_number', formData.poNumber);
    fd.append('submittal_id', formData.submittalId);
    fd.append('reorder_threshold', formData.reorderThreshold);
    fd.append('current_stock', formData.currentStock);
    fd.append('unit_cost', formData.unitCost);

    try {
      const res = await createMaterial(fd);
      if (!res?.success) throw new Error(res?.error || "Failed to create material");
      toast.success("Material created successfully");
      onRefresh();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create material");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-outline-variant/30">
        
        <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface-container-lowest">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <PackageSearch className="w-5 h-5 text-primary" /> Receive / Add Material
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="text-sm font-semibold text-on-surface">Material Name *</label>
            <input required value={formData.itemName} onChange={e=>setFormData({...formData, itemName: e.target.value})} type="text" className="w-full mt-1 p-2 border border-outline-variant rounded bg-surface text-on-surface" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-on-surface">Total Order QTY *</label>
              <input required value={formData.quantity} onChange={e=>setFormData({...formData, quantity: e.target.value})} type="number" className="w-full mt-1 p-2 border border-outline-variant rounded bg-surface text-on-surface" />
            </div>
            <div>
              <label className="text-sm font-semibold text-on-surface">Initial Stock Level</label>
              <input value={formData.currentStock} onChange={e=>setFormData({...formData, currentStock: e.target.value})} type="number" className="w-full mt-1 p-2 border border-outline-variant rounded bg-surface text-on-surface" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-on-surface">PO Number</label>
              <input value={formData.poNumber} onChange={e=>setFormData({...formData, poNumber: e.target.value})} type="text" className="w-full mt-1 p-2 border border-outline-variant rounded bg-surface text-on-surface" />
            </div>
            <div>
              <label className="text-sm font-semibold text-on-surface">Unit Cost ($)</label>
              <input value={formData.unitCost} onChange={e=>setFormData({...formData, unitCost: e.target.value})} type="number" step="0.01" className="w-full mt-1 p-2 border border-outline-variant rounded bg-surface text-on-surface" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-on-surface">Restock Threshold</label>
              <input value={formData.reorderThreshold} onChange={e=>setFormData({...formData, reorderThreshold: e.target.value})} type="number" className="w-full mt-1 p-2 border border-outline-variant rounded bg-surface text-on-surface" placeholder="e.g. 50" />
            </div>
            <div>
              <label className="text-sm font-semibold text-on-surface">Linked Submittal</label>
              <select value={formData.submittalId} onChange={e=>setFormData({...formData, submittalId: e.target.value})} className="w-full mt-1 p-2 border border-outline-variant rounded bg-surface text-on-surface text-sm">
                <option value="">-- None (Unlinked) --</option>
                {submittals.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.spec_section ? sub.spec_section + ' - ' : ''}{sub.title}</option>
                ))}
              </select>
              <p className="text-[10px] text-on-surface-variant mt-1">Links to approved shop drawings.</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-surface-variant text-on-surface rounded font-medium hover:bg-surface-variant/80">Cancel</button>
            <button disabled={loading} type="submit" className="px-6 py-2 bg-primary text-on-primary rounded font-bold hover:bg-primary/90">{loading ? 'Saving...' : 'Add Material'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
