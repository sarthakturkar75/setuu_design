"use client";

import { useState } from "react";
import { X, Upload, FileAudio, Loader2, Bot, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function MeetingMinutesModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any[] | null>(null);
  const router = useRouter();

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      // 1. Transcribe
      const formData = new FormData();
      formData.append("file", file);
      const transcribeRes = await fetch("/api/collaboration/transcribe", {
        method: "POST",
        body: formData,
      });
      const transcribeData = await transcribeRes.json();
      
      if (!transcribeData.text) throw new Error("Transcription failed");

      // 2. Extract Minutes
      const minutesRes = await fetch("/api/collaboration/minutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcribeData.text, projectId }),
      });
      const minutesData = await minutesRes.json();
      
      if (minutesData.success) {
        setResult(minutesData.actionItems);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to process meeting minutes.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-variant/30">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-on-surface">AI Meeting Minutes</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!result ? (
            <div className="space-y-6">
              <p className="text-sm text-on-surface-variant">
                Upload a recording of your site meeting. The AI will transcribe the audio, extract key decisions, and automatically assign Action Items.
              </p>
              
              <div 
                className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-variant/30 transition-colors cursor-pointer"
                onClick={() => document.getElementById('meeting-audio')?.click()}
              >
                <input 
                  type="file" 
                  id="meeting-audio" 
                  className="hidden" 
                  accept="audio/*,video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  {file ? <FileAudio className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                </div>
                <h3 className="text-sm font-medium text-on-surface mb-1">
                  {file ? file.name : "Click to upload recording"}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "MP3, WAV, M4A up to 25MB"}
                </p>
              </div>

              {file && (
                <button 
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full py-3 bg-primary text-on-primary rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-70"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
                  {isProcessing ? "Transcribing & Analyzing..." : "Generate Minutes"}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-semantic-emerald/10 text-semantic-emerald rounded-lg border border-semantic-emerald/20 mb-6">
                Meeting analyzed successfully. {result.length} action items extracted and logged to Project Issues.
              </div>
              
              <h3 className="font-semibold text-on-surface">Extracted Action Items</h3>
              <div className="space-y-3">
                {result.map((item, idx) => (
                  <div key={idx} className="p-4 border border-outline-variant rounded-xl bg-surface-variant/20">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-on-surface">{item.title}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {item.assignee_role}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => {
                    onClose();
                    router.refresh();
                  }}
                  className="w-full py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
