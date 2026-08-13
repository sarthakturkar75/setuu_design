"use client";

import { LockIcon, SendIcon, InfoIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function NewChangeRequestPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 max-w-3xl mx-auto w-full pb-20">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-inter text-on-surface tracking-tight">Draft Change Request</h1>
        <p className="text-sm text-on-surface-variant font-inter mt-1">Submit a formal request for scope or timeline adjustments.</p>
      </div>

      <Card className="border-outline-variant/50 shadow-sm">
        <CardHeader className="bg-surface-container/30 border-b border-outline-variant/30 pb-4">
          <CardTitle>Change Request Form</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">Request Title</label>
            <input 
              type="text" 
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary"
              placeholder="e.g. Additional wiring for HVAC unit"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">Detailed Justification</label>
            <textarea 
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary min-h-[120px]"
              placeholder="Explain why this change is necessary..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">Estimated Time Impact (Days)</label>
              <input 
                type="number" 
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary font-jetbrains-mono"
                placeholder="+0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2 flex items-center gap-2">
                Estimated Cost Impact
                <LockIcon className="w-3.5 h-3.5 text-primary" />
              </label>
              <div className="w-full bg-surface-container-highest border border-outline-variant/50 rounded-lg px-4 py-2.5 text-on-surface-variant flex items-center cursor-not-allowed select-none">
                <span className="opacity-60 flex items-center gap-2">
                  <LockIcon className="w-4 h-4" /> Admin assessment required
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1.5 flex items-start gap-1">
                <InfoIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Financial scoping is restricted. Admins will negotiate cost impacts with the client.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-outline-variant/30 flex justify-end">
            <button className="bg-primary text-white font-medium rounded-lg px-6 py-2.5 flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
              <SendIcon className="w-4 h-4" />
              Submit to Admin Queue
            </button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
