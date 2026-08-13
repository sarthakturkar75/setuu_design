"use client";

import { useState } from "react";
import { AlertTriangleIcon, CameraIcon, CheckIcon } from "lucide-react";

export default function FieldIssueLoggerPage({ params }: { params: { id: string } }) {
  const [severity, setSeverity] = useState<"low" | "high" | "critical" | null>(null);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto w-full pb-24">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-inter text-on-surface tracking-tight">Log Field Issue</h1>
        <p className="text-sm text-on-surface-variant font-inter mt-1">Rapid entry logger for on-site blockers.</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        
        {/* Massive Touch Targets for Severity */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-on-surface-variant mb-2">Select Severity</label>
          
          <button 
            type="button"
            onClick={() => setSeverity("critical")}
            className={`w-full min-h-[48px] rounded-xl flex items-center justify-between px-4 transition-all ${
              severity === "critical" 
                ? "bg-semantic-crimson text-white border-2 border-semantic-crimson shadow-md" 
                : "bg-surface-container border border-outline-variant text-on-surface hover:border-semantic-crimson hover:bg-semantic-crimson/10"
            }`}
          >
            <span className="font-bold uppercase tracking-wide">Critical Blocker</span>
            {severity === "critical" && <CheckIcon className="w-5 h-5" />}
          </button>

          <button 
            type="button"
            onClick={() => setSeverity("high")}
            className={`w-full min-h-[48px] rounded-xl flex items-center justify-between px-4 transition-all ${
              severity === "high" 
                ? "bg-semantic-amber text-white border-2 border-semantic-amber shadow-md" 
                : "bg-surface-container border border-outline-variant text-on-surface hover:border-semantic-amber hover:bg-semantic-amber/10"
            }`}
          >
            <span className="font-bold uppercase tracking-wide">High Priority</span>
            {severity === "high" && <CheckIcon className="w-5 h-5" />}
          </button>

          <button 
            type="button"
            onClick={() => setSeverity("low")}
            className={`w-full min-h-[48px] rounded-xl flex items-center justify-between px-4 transition-all ${
              severity === "low" 
                ? "bg-semantic-sky text-white border-2 border-semantic-sky shadow-md" 
                : "bg-surface-container border border-outline-variant text-on-surface hover:border-semantic-sky hover:bg-semantic-sky/10"
            }`}
          >
            <span className="font-bold uppercase tracking-wide">Low / General</span>
            {severity === "low" && <CheckIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Issue Details */}
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-2">Issue Description</label>
          <textarea 
            className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary min-h-[120px]"
            placeholder="Describe the issue, location, and immediate impact..."
            required
          ></textarea>
        </div>

        {/* Media Attachment */}
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-2">Attach Evidence</label>
          <button type="button" className="w-full min-h-[64px] border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center gap-3 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
            <CameraIcon className="w-6 h-6" />
            <span className="font-medium">Take Photo or Video</span>
          </button>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button 
            type="submit"
            className="w-full min-h-[56px] bg-primary text-white rounded-xl font-bold uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg active:scale-[0.98]"
          >
            <AlertTriangleIcon className="w-5 h-5" />
            Log Issue to Database
          </button>
        </div>

      </form>
    </div>
  );
}
