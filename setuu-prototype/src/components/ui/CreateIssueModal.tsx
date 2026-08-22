"use client";

import React, { useState } from 'react';
import { X, Mic } from 'lucide-react';
import { useToast } from "@/contexts/ToastContext";
import { createIssue } from "@/app/actions/issueActions";
import { DefectMediaUploader } from "./DefectMediaUploader";

export function CreateIssueModal({ projectId, rootCauses, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'Medium',
    rootCauseId: '',
    reworkCost: ''
  });
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);

  // Task 6: NLP Voice Parse
  const handleVoiceDictation = async () => {
    // Physical Web Speech API to capture true audio from the microphone
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setRecording(true);
    toast.info("Listening... Speak now.");

    recognition.onresult = async (event: any) => {
      const realTranscript = event.results[0][0].transcript;
      toast.info("Transcribed. Parsing NLP...");
      
      try {
        const res = await fetch('/api/issues/voice-parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: realTranscript })
        });
        
        const data = await res.json();
        if (data.success) {
           setFormData(prev => ({
             ...prev,
             title: data.parsedData.title || prev.title,
             description: data.parsedData.description || prev.description,
             severity: data.parsedData.severity || prev.severity,
             reworkCost: data.parsedData.estimated_rework_cost?.toString() || prev.reworkCost 
           }));
           toast.success("Voice transcribed and NLP parsed!");
        } else {
           toast.error(data.error || "NLP Failed");
        }
      } catch (err) {
        toast.error("Network error during NLP parsing");
      } finally {
        setRecording(false);
      }
    };

    recognition.onerror = (event: any) => {
      toast.error(`Speech recognition error: ${event.error}`);
      setRecording(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("project_id", projectId);
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("severity", formData.severity);
      fd.append("root_cause_id", formData.rootCauseId);
      fd.append("estimated_rework_cost", formData.reworkCost);
      fd.append("media_assets", JSON.stringify(mediaAssets));

      const res = await createIssue(fd);
      if (res.success) {
        toast.success("Issue logged successfully");
        onRefresh();
      } else {
        toast.error(res.error || "Failed to log issue");
      }
    } catch (err) {
      toast.error("Error creating issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-outline-variant/30">
        
        <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface-container-lowest">
          <h2 className="text-xl font-bold text-on-surface font-merriweather">Log New Defect / Issue</h2>
          <div className="flex gap-2">
            <button type="button" onClick={handleVoiceDictation} className={`p-2 rounded-full flex items-center justify-center ${recording ? 'bg-semantic-crimson text-white animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
              <Mic className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          <div>
            <label className="text-sm font-semibold text-on-surface">Title</label>
            <input required type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="mt-1 w-full p-2 rounded bg-surface border border-outline-variant text-sm text-on-surface" placeholder="e.g. Drywall crack in Zone C" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-on-surface">Severity (Drives SLA)</label>
              <select required value={formData.severity} onChange={e=>setFormData({...formData, severity: e.target.value})} className="mt-1 w-full p-2 rounded bg-surface border border-outline-variant text-sm text-on-surface">
                <option value="Critical">Critical (24h SLA)</option>
                <option value="High">High (72h SLA)</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-on-surface">Root Cause</label>
              <select required value={formData.rootCauseId} onChange={e=>setFormData({...formData, rootCauseId: e.target.value})} className="mt-1 w-full p-2 rounded bg-surface border border-outline-variant text-sm text-on-surface">
                <option value="">-- Select RCA --</option>
                {rootCauses.map((rc:any) => (
                  <option key={rc.id} value={rc.id}>{rc.category} - {rc.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-on-surface">Description</label>
            <textarea required value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="mt-1 w-full p-2 rounded bg-surface border border-outline-variant text-sm text-on-surface" rows={3} />
          </div>

          <div>
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">Estimated Rework Cost ($)</label>
            <input required type="number" step="0.01" value={formData.reworkCost} onChange={e=>setFormData({...formData, reworkCost: e.target.value})} className="mt-1 w-full p-2 rounded bg-surface border border-outline-variant text-sm text-on-surface" placeholder="e.g. 1500.00" />
            <p className="text-[10px] text-on-surface-variant mt-1">Rolls up into Unplanned Rework KPI.</p>
          </div>

          <DefectMediaUploader onChange={(assets) => setMediaAssets(assets)} />

          <div className="pt-4 border-t border-outline-variant/50 flex justify-end gap-3 mt-2">
             <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-variant rounded transition-colors">Cancel</button>
             <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-semantic-crimson text-white font-semibold rounded hover:bg-semantic-crimson/90 transition-colors">Log Issue</button>
          </div>
        </form>
      </div>
    </div>
  );
}
