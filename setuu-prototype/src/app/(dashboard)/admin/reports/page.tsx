"use client";

import { useState } from "react";
import { FileTextIcon, DownloadIcon, CheckIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function ReportsPage() {
  const [selectedProject, setSelectedProject] = useState("all");
  const [modules, setModules] = useState({
    financials: true,
    timeline: true,
    materials: false,
    issues: true,
    safety: false,
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  const toggleModule = (key: keyof typeof modules) => {
    setModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setReportUrl(null);
    
    // Simulate generation time
    await new Promise(r => setTimeout(r, 2000));
    
    setReportUrl("#");
    setIsGenerating(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 w-full pb-20 pt-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Automated Reporting Engine</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Configure and compile comprehensive executive PDF reports on-demand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileTextIcon className="w-5 h-5 text-primary" />
                <CardTitle>Report Configuration</CardTitle>
              </div>
              <CardDescription>Select the data modules to include in the compiled document.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-8">
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-on-surface">Target Scope</label>
                  <select 
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full bg-surface rounded-md border border-outline-variant p-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">Global Portfolio Summary (All Projects)</option>
                    <option value="p1">Project Alpha (PRJ-001)</option>
                    <option value="p2">Project Beta (PRJ-002)</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-on-surface">Included Modules</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "financials", label: "Financials & Budget Variance", desc: "Includes change request impacts." },
                      { id: "timeline", label: "Timeline & Milestones", desc: "Critical path analysis." },
                      { id: "materials", label: "Material Procurement", desc: "Supply chain status and POs." },
                      { id: "issues", label: "Issues & Blockers", desc: "Triage and severity metrics." },
                      { id: "safety", label: "Safety & Compliance", desc: "Incident reports and audits." },
                    ].map((mod) => (
                      <div 
                        key={mod.id} 
                        className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${
                          modules[mod.id as keyof typeof modules] 
                            ? "border-primary bg-primary/5" 
                            : "border-outline-variant bg-surface hover:bg-surface-container"
                        }`}
                        onClick={() => toggleModule(mod.id as keyof typeof modules)}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                            modules[mod.id as keyof typeof modules] ? "bg-primary border-primary" : "border-outline-variant bg-surface"
                          }`}>
                            {modules[mod.id as keyof typeof modules] && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                          </div>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-semibold text-on-surface">{mod.label}</h4>
                          <p className="text-xs text-on-surface-variant mt-0.5">{mod.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/30 flex justify-end">
                  <button
                    type="submit"
                    disabled={isGenerating || !Object.values(modules).some(Boolean)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary text-sm font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isGenerating ? "Compiling PDF..." : "Generate Report"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportUrl && (
                <div className="p-4 bg-semantic-emerald/10 border border-semantic-emerald/30 rounded-lg">
                  <h4 className="text-sm font-semibold text-semantic-emerald mb-1">Compilation Complete</h4>
                  <p className="text-xs text-semantic-emerald/80 mb-3">Your executive report is ready.</p>
                  <a href={reportUrl} className="w-full flex justify-center items-center gap-2 px-3 py-2 bg-semantic-emerald text-white rounded font-medium text-xs hover:bg-semantic-emerald/90 transition-colors">
                    <DownloadIcon className="w-4 h-4" />
                    Download PDF
                  </a>
                </div>
              )}
              
              <div className="space-y-3">
                {[
                  { name: "Global_Portfolio_Q3.pdf", date: "Oct 1, 2026", size: "2.4 MB" },
                  { name: "Project_Alpha_Safety.pdf", date: "Sep 28, 2026", size: "1.1 MB" },
                  { name: "Financials_Sep26.pdf", date: "Sep 15, 2026", size: "0.8 MB" }
                ].map((r, i) => (
                  <div key={i} className="p-3 bg-surface border border-outline-variant rounded-md flex justify-between items-center group">
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-on-surface font-jetbrains-mono truncate">{r.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-on-surface-variant">{r.date}</span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                        <span className="text-[10px] text-on-surface-variant">{r.size}</span>
                      </div>
                    </div>
                    <button className="text-on-surface-variant group-hover:text-primary transition-colors p-1.5 bg-surface-container rounded-sm">
                      <DownloadIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
