"use client";

import { useState, useEffect } from "react";
import { CloudOffIcon, RefreshCwIcon, CheckCircle2Icon, AlertTriangleIcon } from "lucide-react";

export default function OfflineSyncPage() {
  const [syncState, setSyncState] = useState<"queued" | "syncing" | "failed" | "success">("queued");

  // Simulate sync lifecycle
  useEffect(() => {
    const timer1 = setTimeout(() => setSyncState("syncing"), 2000);
    const timer2 = setTimeout(() => setSyncState("failed"), 5000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleRetry = () => {
    setSyncState("syncing");
    setTimeout(() => setSyncState("success"), 3000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto w-full pb-24">
      
      <div className="mb-6 text-center">
        <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 transition-colors ${
          syncState === "queued" ? "bg-semantic-amber/20 text-semantic-amber" :
          syncState === "syncing" ? "bg-semantic-sky/20 text-semantic-sky" :
          syncState === "failed" ? "bg-semantic-crimson/20 text-semantic-crimson" :
          "bg-semantic-emerald/20 text-semantic-emerald"
        }`}>
          {syncState === "queued" && <CloudOffIcon className="w-8 h-8" />}
          {syncState === "syncing" && <RefreshCwIcon className="w-8 h-8 animate-spin" />}
          {syncState === "failed" && <AlertTriangleIcon className="w-8 h-8" />}
          {syncState === "success" && <CheckCircle2Icon className="w-8 h-8" />}
        </div>
        <h1 className="text-2xl font-bold font-inter text-on-surface tracking-tight">Sync Engine</h1>
        <p className="text-sm text-on-surface-variant font-inter mt-1">Manage offline payloads and media.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Pending Payloads (1)</h2>
        
        {/* Dynamic Sync Card */}
        <div className={`bg-surface-container-lowest rounded-xl p-5 border-2 transition-all ${
          syncState === "queued" ? "border-semantic-amber shadow-[0_0_15px_rgba(217,119,6,0.2)] animate-pulse" :
          syncState === "syncing" ? "border-semantic-sky shadow-[0_0_20px_rgba(2,132,199,0.3)]" :
          syncState === "failed" ? "border-semantic-crimson shadow-[0_0_15px_rgba(220,38,38,0.2)]" :
          "border-semantic-emerald opacity-50"
        }`}>
          <div className="flex justify-between items-start mb-3">
            <span className="font-bold text-on-surface">Milestone Progress Update</span>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              syncState === "queued" ? "text-semantic-amber" :
              syncState === "syncing" ? "text-semantic-sky" :
              syncState === "failed" ? "text-semantic-crimson" :
              "text-semantic-emerald"
            }`}>
              {syncState}
            </span>
          </div>
          
          <p className="text-sm text-on-surface-variant mb-4">
            Includes 1 text caption and 3 high-resolution images (12.4 MB).
          </p>

          <div className="flex items-center justify-between text-xs font-jetbrains-mono text-on-surface-variant">
            <span>ID: 0x4A8B...</span>
            <span>Recorded: 14:32 Local</span>
          </div>

          {syncState === "failed" && (
            <button 
              onClick={handleRetry}
              className="mt-4 w-full py-2 bg-semantic-crimson/10 text-semantic-crimson border border-semantic-crimson rounded-lg font-bold text-sm hover:bg-semantic-crimson/20 transition-colors"
            >
              Retry Sync Now
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
