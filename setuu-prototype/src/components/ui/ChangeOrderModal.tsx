"use client";

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, History, Calculator, FileSignature, Upload } from 'lucide-react';
import { useToast } from "@/contexts/ToastContext";
import { advanceChangeWorkflow, sendForEsignature } from "@/app/actions/changeOrderActions";

export function ChangeOrderModal({ change, contractValue, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!change) return null;

  const currentStage = change.custom_data?.approval_stage || "Vendor Proposed";
  const rawCost = change.custom_data?.raw_cost || 0;
  
  // Impact Calculator
  const marginImpact = contractValue > 0 ? ((change.cost_impact / contractValue) * 100).toFixed(2) : "0.00";
  const isApproved = change.status === 'Approved';

  const handleSignOff = async (role: string) => {
    setLoading(true);
    try {
      const res = await advanceChangeWorkflow(change.id, role, currentStage);
      if (res.success) {
        toast.success(`Signed off as ${role}`);
        onRefresh();
      } else {
        toast.error(res.error || "Failed to sign");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDocuSign = async () => {
    setLoading(true);
    try {
      const res = await sendForEsignature(change.id);
      if (res.success) {
        toast.success(res.message as string);
        onRefresh();
      } else {
        toast.error(res.error || "Failed DocuSign dispatch");
      }
    } catch (e) {
      toast.error("DocuSign Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-outline-variant/30">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface-container-lowest">
          <div>
            <h2 className="text-xl font-bold text-on-surface font-merriweather">{change.title}</h2>
            <div className="flex gap-2 items-center mt-1 text-sm text-on-surface-variant">
              <span>{change.display_id || change.id.substring(0,8)}</span>
              <span>&bull;</span>
              <span className={`font-semibold ${isApproved ? 'text-semantic-emerald' : 'text-semantic-amber'}`}>{change.status}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full"><X className="w-5 h-5 text-on-surface-variant" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
          
          {/* Main Info Column */}
          <div className="flex-1 space-y-6">
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Description</h3>
              <p className="text-on-surface text-sm bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/30">
                {change.description || "No description provided."}
              </p>
            </section>

            {/* Impact Calculator Widget */}
            <section className="bg-surface-variant/30 rounded-lg p-5 border border-outline-variant/50">
              <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-4">
                <Calculator className="w-4 h-4 text-primary" /> Impact Forecast
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface p-3 rounded shadow-sm">
                  <div className="text-xs text-on-surface-variant mb-1">Financial Impact</div>
                  <div className="text-lg font-mono font-bold text-on-surface">${Number(change.cost_impact).toLocaleString()}</div>
                  <div className="text-xs text-semantic-crimson mt-1">+{marginImpact}% of Total Budget</div>
                  {rawCost > 0 && (
                    <div className="text-[10px] text-on-surface-variant mt-2 border-t border-outline-variant/50 pt-1">
                      Raw: ${rawCost} | OH: 15% | P: 5%
                    </div>
                  )}
                </div>
                <div className="bg-surface p-3 rounded shadow-sm">
                  <div className="text-xs text-on-surface-variant mb-1">Schedule Impact</div>
                  <div className="text-lg font-mono font-bold text-on-surface">{change.time_impact_days || 0} Days</div>
                  <div className="text-xs text-semantic-amber mt-1">Shifts master critical path</div>
                </div>
              </div>
            </section>

            {/* Audit Log Timeline */}
            <section>
              <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-on-surface-variant" /> Immutable Audit Log
              </h3>
              <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant before:to-transparent">
                {change.change_requests_history?.map((hist: any, i: number) => (
                  <div key={hist.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-surface-variant text-on-surface-variant shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></div>
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-surface p-3 rounded border border-outline-variant/30 shadow-sm">
                      <div className="text-xs font-bold text-on-surface">v{change.change_requests_history.length - i} snapshot</div>
                      <div className="text-[10px] text-on-surface-variant">{new Date(hist.changed_at).toLocaleString()} by {hist.changed_by.substring(0,8)}</div>
                    </div>
                  </div>
                ))}
                {(!change.change_requests_history || change.change_requests_history.length === 0) && (
                   <p className="text-xs text-on-surface-variant pl-6">No historical edits found.</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Column: Signatures */}
          <div className="w-full lg:w-72 flex flex-col gap-4">
             <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-primary" /> E-Signature Workflow
                </h3>
                
                <div className="space-y-4 relative">
                  {['Vendor Proposed', 'PM Recommended', 'Admin Approved', 'Client Signed'].map((stage, idx) => {
                    const isPassed = ['Vendor Proposed', 'PM Recommended', 'Admin Approved', 'Client Signed'].indexOf(currentStage) > idx || (isApproved && stage === 'Client Signed');
                    const isActive = currentStage === stage && !isApproved;
                    
                    const sigRecord = change.change_signatures?.find((s:any) => s.role.includes(stage.split(' ')[0]));
                    
                    return (
                      <div key={stage} className={`flex gap-3 items-start ${!isPassed && !isActive ? 'opacity-50' : ''}`}>
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isPassed ? 'bg-semantic-emerald text-white' : isActive ? 'bg-primary text-on-primary ring-2 ring-primary/20' : 'bg-surface-variant text-on-surface-variant'}`}>
                           {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                         </div>
                         <div>
                           <div className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-on-surface'}`}>{stage}</div>
                           {isPassed && sigRecord && (
                             <div className="text-[10px] text-on-surface-variant mt-0.5 flex flex-col gap-0.5">
                               <span>Signed: {new Date(sigRecord.signed_at).toLocaleString()}</span>
                               <span className="font-mono bg-surface p-0.5 rounded px-1 w-fit border border-outline-variant/50">IP: {sigRecord.ip_address}</span>
                               {sigRecord.esign_envelope_id && <span className="text-semantic-sky">Env: {sigRecord.esign_envelope_id}</span>}
                             </div>
                           )}
                           
                           {isActive && (
                             <div className="mt-2">
                               {stage === 'Client Signed' ? (
                                 <button onClick={handleDocuSign} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#005CB9] hover:bg-[#004b99] text-white text-xs px-3 py-2 rounded transition-colors">
                                   Dispatch to DocuSign
                                 </button>
                               ) : (
                                 <button onClick={() => handleSignOff(stage.split(' ')[0])} disabled={loading} className="bg-primary hover:bg-primary/90 text-on-primary text-xs px-3 py-1.5 rounded transition-colors">
                                   Sign & Advance
                                 </button>
                               )}
                             </div>
                           )}
                         </div>
                      </div>
                    )
                  })}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
