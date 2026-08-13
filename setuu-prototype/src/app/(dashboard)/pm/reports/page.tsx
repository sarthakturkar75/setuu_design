"use client";

import { useState } from "react";
import { DownloadIcon, FileTextIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function PmReportingPage() {
  const [selectedModules, setSelectedModules] = useState({
    milestones: true,
    issues: true,
    materials: false,
    photos: true,
    financials: false // Always disabled for PM ideally, but toggleable for logic
  });

  const toggleModule = (key: keyof typeof selectedModules) => {
    setSelectedModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full pb-20">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-inter text-on-surface tracking-tight">Automated Reporting Engine</h1>
        <p className="text-sm text-on-surface-variant font-inter mt-1">Configure and export project progress reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Configuration Pane */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-outline-variant/50 shadow-sm">
            <CardHeader className="bg-surface-container/30 border-b border-outline-variant/30 pb-4">
              <CardTitle>Report Modules</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <label className="flex items-center gap-3 p-3 border border-outline-variant rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary" 
                  checked={selectedModules.milestones}
                  onChange={() => toggleModule('milestones')}
                />
                <div>
                  <div className="font-medium text-on-surface text-sm">Milestone Progress</div>
                  <div className="text-xs text-on-surface-variant">Checklist completion metrics and phase statuses.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-outline-variant rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary" 
                  checked={selectedModules.issues}
                  onChange={() => toggleModule('issues')}
                />
                <div>
                  <div className="font-medium text-on-surface text-sm">Active Issues & Blockers</div>
                  <div className="text-xs text-on-surface-variant">List of outstanding critical and high severity issues.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-outline-variant rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary" 
                  checked={selectedModules.materials}
                  onChange={() => toggleModule('materials')}
                />
                <div>
                  <div className="font-medium text-on-surface text-sm">Material Ledger</div>
                  <div className="text-xs text-on-surface-variant">Recent deliveries and pending POs.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-outline-variant rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary" 
                  checked={selectedModules.photos}
                  onChange={() => toggleModule('photos')}
                />
                <div>
                  <div className="font-medium text-on-surface text-sm">Field Photography</div>
                  <div className="text-xs text-on-surface-variant">Appendix of timestamped media attachments.</div>
                </div>
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Action & Summary Pane */}
        <div className="md:col-span-1">
          <Card className="border-outline-variant/50 shadow-sm sticky top-6">
            <CardHeader className="pb-2">
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-4 flex justify-center">
                <FileTextIcon className="w-16 h-16 text-primary/40" />
              </div>
              <p className="text-sm text-center text-on-surface-variant mb-6">
                Generate a formal PDF report based on the selected configuration modules.
              </p>
              
              <button className="w-full bg-primary text-white font-bold tracking-wide rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
                <DownloadIcon className="w-4 h-4" />
                Generate PDF
              </button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
