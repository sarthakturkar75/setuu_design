"use client";

import React, { useState } from 'react';
import { X, FileText, PackagePlus, MapPin, AlertCircle, Trash } from 'lucide-react';
import { useToast } from "@/contexts/ToastContext";
import { logSplitDelivery, assignMaterialLocation } from "@/app/actions/materialActions";

export function MaterialDetailsModal({ material, locations, onClose, onRefresh, onLogWaste }: any) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  const [splitQty, setSplitQty] = useState('');
  const [splitDate, setSplitDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(material.location_id || '');

  const handleSplitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await logSplitDelivery(material.id, parseFloat(splitQty), splitDate);
      if (res.success) {
        toast.success("Split delivery logged.");
        setSplitQty(''); setSplitDate('');
        onRefresh();
      } else {
        toast.error(res.error || "Failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locId = e.target.value;
    setSelectedLocation(locId);
    setLoading(true);
    const res = await assignMaterialLocation(material.id, locId);
    if (res.success) {
      toast.success("Laydown yard assigned.");
      onRefresh();
    } else {
      toast.error("Failed to assign location.");
    }
    setLoading(false);
  };

  const splits = material.custom_data?.split_deliveries || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-outline-variant/30">
        
        <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface-container-lowest">
          <div>
            <h2 className="text-xl font-bold text-on-surface font-merriweather">{material.item_name}</h2>
            <p className="text-xs text-on-surface-variant font-mono mt-1">PO: {material.po_number || 'N/A'} &bull; Supplier: {material.supplier_name || 'N/A'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            
            <section className="bg-surface-variant/20 rounded-lg p-4 border border-outline-variant/30">
               <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-4">
                 <FileText className="w-4 h-4 text-primary" /> Submittal & Spec Linker
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-on-surface-variant">Approved Submittal ID</label>
                    <div className="mt-1 font-mono text-sm bg-surface p-2 rounded border border-outline-variant/50 text-on-surface">{material.submittal_id || 'Unlinked'}</div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-on-surface-variant">Specification ID</label>
                    <div className="mt-1 font-mono text-sm bg-surface p-2 rounded border border-outline-variant/50 text-on-surface">{material.spec_id || 'Unlinked'}</div>
                  </div>
               </div>
               <p className="text-[10px] text-on-surface-variant mt-2 italic">Receivers must verify physical delivery against approved architectural shop drawings bound to this Submittal ID.</p>
            </section>

            <section>
               <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-3">
                 <PackagePlus className="w-4 h-4 text-primary" /> Split Delivery Logs
               </h3>
               {splits.length === 0 ? (
                 <p className="text-xs text-on-surface-variant">No split deliveries logged. Full order expected.</p>
               ) : (
                 <div className="space-y-2">
                   {splits.map((s:any, i:number) => (
                     <div key={i} className="flex justify-between items-center p-3 bg-surface border border-outline-variant/30 rounded shadow-sm text-sm">
                       <div className="font-mono font-bold text-primary">QTY: {s.quantity}</div>
                       <div className="text-on-surface-variant">Date: {new Date(s.date).toLocaleDateString()}</div>
                       <div className="text-[10px] text-on-surface-variant bg-surface-variant/30 px-2 py-1 rounded">Logged: {new Date(s.logged_at).toLocaleDateString()}</div>
                     </div>
                   ))}
                 </div>
               )}

               <form onSubmit={handleSplitSubmit} className="mt-4 p-4 bg-surface-container-lowest border border-dashed border-outline-variant/50 rounded-lg">
                 <h4 className="text-xs font-semibold text-on-surface uppercase mb-3">Log Partial Arrival</h4>
                 <div className="flex gap-3 items-end">
                   <div className="flex-1">
                     <label className="text-[10px] font-semibold text-on-surface-variant">Arrived QTY</label>
                     <input required type="number" value={splitQty} onChange={e=>setSplitQty(e.target.value)} className="w-full p-2 mt-1 rounded bg-surface border border-outline-variant text-sm text-on-surface" />
                   </div>
                   <div className="flex-1">
                     <label className="text-[10px] font-semibold text-on-surface-variant">Arrival Date</label>
                     <input required type="date" value={splitDate} onChange={e=>setSplitDate(e.target.value)} className="w-full p-2 mt-1 rounded bg-surface border border-outline-variant text-sm text-on-surface" />
                   </div>
                   <button disabled={loading} type="submit" className="px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded hover:bg-primary/90">Add</button>
                 </div>
               </form>
            </section>
          </div>

          <div className="w-full lg:w-72 flex flex-col gap-6">
            <section className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Laydown Yard
              </h3>
              <select value={selectedLocation} onChange={handleLocationChange} disabled={loading} className="w-full p-2 rounded bg-surface border border-outline-variant text-sm text-on-surface">
                <option value="">-- Unassigned --</option>
                {locations.map((loc:any) => (
                  <option key={loc.id} value={loc.id}>{loc.zone ? `Zone ${loc.zone} - ` : ''}{loc.name}</option>
                ))}
              </select>
              {selectedLocation && (
                <div className="mt-3 p-3 bg-semantic-emerald/10 border border-semantic-emerald/20 rounded text-xs text-semantic-emerald font-medium">
                  Material physically assigned to {locations.find((l:any)=>l.id === selectedLocation)?.name}.
                </div>
              )}
            </section>

            <section className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-semantic-crimson mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Issue Management
              </h3>
              <p className="text-xs text-on-surface-variant mb-4">Did this material arrive damaged? Log waste to track financial losses.</p>
              <button onClick={() => { onClose(); onLogWaste(); }} className="w-full py-2 bg-semantic-crimson/10 text-semantic-crimson hover:bg-semantic-crimson/20 border border-semantic-crimson/30 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                <Trash className="w-4 h-4" /> Log Waste & Scrap
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
