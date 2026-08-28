"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { FileTextIcon, DownloadIcon } from "lucide-react";
import { getProjectReports } from "@/app/actions/reportActions";

export default function PMReports() {
  const toast = useToast();
  const [selectedModules, setSelectedModules] = useState<string[]>(["summary", "milestones"]);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await getProjectReports();
        setReports(data || []);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReports();
  }, []);

  const toggleModule = (mod: string) => {
    setSelectedModules(prev =>
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-300 mx-auto">
      <PageHeader
        title="Project Reporting"
        subtitle="Generate and export comprehensive project status reports."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-on-surface mb-4">Report Builder</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface">Select Project</label>
                <select className="w-full bg-surface-variant border border-outline-variant rounded-lg p-2.5 text-on-surface text-sm">
                  <option>Alpha Tower Build</option>
                  <option>Sector 7 Pipeline</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface">Include Modules</label>
                <div className="space-y-2">
                  {[
                    { id: "summary", label: "Executive Summary" },
                    { id: "milestones", label: "Milestone Progress" },
                    { id: "financials", label: "Financials & Budget" },
                    { id: "issues", label: "Issues & Blockers" },
                    { id: "photos", label: "Recent Photos" },
                  ].map(mod => (
                    <label key={mod.id} className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant hover:bg-surface-variant cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                        checked={selectedModules.includes(mod.id)}
                        onChange={() => toggleModule(mod.id)}
                      />
                      <span className="text-sm text-on-surface font-medium">{mod.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant flex justify-end">
              <Button variant="primary" size="lg" onClick={() => toast.info("Report generation initiated...")}>
                <FileTextIcon className="w-5 h-5 mr-2" /> Generate PDF Report
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-on-surface">Recent Exports</h3>
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-sm text-on-surface-variant">Loading exports...</div>
            ) : reports.length === 0 ? (
              <div className="text-sm text-on-surface-variant">No recent exports.</div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="p-3 bg-surface-container rounded-lg border border-outline-variant flex items-center justify-between group hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileTextIcon className="w-5 h-5 text-semantic-crimson" />
                    <div>
                      <div className="text-sm font-medium text-on-surface">Project_{report.project_id}_Report.pdf</div>
                      <div className="text-xs text-on-surface-variant">{new Date(report.generated_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <button className="text-on-surface-variant hover:text-primary p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DownloadIcon className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
