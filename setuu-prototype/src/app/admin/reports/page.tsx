"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { TextInput } from "@/components/ui/TextInput";
import { Toggle } from "@/components/ui/Toggle";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FileBarChart, Play, CalendarClock, Download, FileText, FileSpreadsheet, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProjectReports } from "@/app/actions/reportActions";

export default function ReportingEnginePage() {
  const [template, setTemplate] = useState("");
  const [frequency, setFrequency] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [outputFormat, setOutputFormat] = useState<"pdf" | "csv">("pdf");
  const [exportsData, setExportsData] = useState<any[]>([]);

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await getProjectReports();
        setExportsData(data || []);
      } catch (error) {
        console.error("Failed to load reports:", error);
      }
    }
    loadReports();
  }, []);

  const columns = [
    { 
      key: "report", 
      header: "Report ID", 
      sortable: true,
      cell: (row: any) => {
        let name = "Project Report";
        try {
          const data = JSON.parse(row.report_data);
          if (data && data.name) name = data.name;
        } catch(e) {}
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-on-surface">{name}</span>
            
          </div>
        );
      }
    },
    { 
      key: "project", 
      header: "Project", 
      cell: (row: any) => (
        <div className="flex items-center gap-1.5 text-on-surface-variant text-sm font-medium">
          {row.project_id ? row.project_id.substring(0, 8) : "N/A"}
        </div>
      )
    },
    { 
      key: "generated_at", 
      header: "Generated At", 
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains text-sm text-on-surface-variant">{row.generated_at ? new Date(row.generated_at).toLocaleString() : 'N/A'}</span>
    },
    { 
      key: "actions", 
      header: "", 
      cell: (row: any) => (
        <button 
          className="flex items-center gap-1 text-sm font-semibold transition-colors text-primary hover:text-primary/80"
        >
          <Download className="w-4 h-4" /> Download
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Automated Reporting Engine" 
        subtitle="Generate and schedule comprehensive analytics and compliance exports"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Reports</span>
          </div>
        }
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-elevation-l1">
            <Play className="w-4 h-4" />
            Generate Now
          </button>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row gap-6">
        
        {/* Configuration Panel */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <Card className="p-6 flex flex-col gap-6">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-on-surface">Report Configuration</h2>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Report Template</label>
              <Select 
                options={[
                  { label: "Financial Summary (Budget vs Actual)", value: "financials" },
                  { label: "Resource Allocation Matrix", value: "resources" },
                  { label: "Vendor SLA Compliance", value: "vendors" },
                  { label: "Project Health & Timelines", value: "projects" },
                  { label: "Custom Export", value: "custom" },
                ]}
                value={template}
                onChange={(val) => setTemplate(val)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Output Format</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setOutputFormat("pdf")}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors ${outputFormat === "pdf" ? "border-primary bg-primary/5 text-primary" : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary/50"}`}
                >
                  <FileText className="w-8 h-8" />
                  <span className="font-semibold">Executive PDF</span>
                </button>
                <button 
                  onClick={() => setOutputFormat("csv")}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors ${outputFormat === "csv" ? "border-primary bg-primary/5 text-primary" : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary/50"}`}
                >
                  <FileSpreadsheet className="w-8 h-8" />
                  <span className="font-semibold">Raw Data (CSV)</span>
                </button>
              </div>
            </div>
          </Card>

          <Card className={`p-6 flex flex-col gap-6 border-2 transition-colors ${isRecurring ? "border-primary/50 bg-primary/5" : "border-outline-variant bg-surface"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isRecurring ? "bg-primary text-on-primary shadow-elevation-l1" : "bg-surface-variant text-on-surface-variant"}`}>
                  <CalendarClock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold text-on-surface">Execution Schedule</h2>
                  <span className="text-sm text-on-surface-variant">Run this report automatically</span>
                </div>
              </div>
              <Toggle checked={isRecurring} onChange={(checked) => setIsRecurring(checked)} />
            </div>

            {isRecurring && (
              <div className="flex flex-col gap-4 pt-4 border-t border-outline-variant animate-in slide-in-from-top-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Frequency</label>
                  <Select 
                    options={[
                      { label: "Daily at Midnight", value: "daily" },
                      { label: "Weekly (Monday 8:00 AM)", value: "weekly" },
                      { label: "Monthly (1st of Month)", value: "monthly" },
                      { label: "Custom Cron Schedule", value: "custom" },
                    ]}
                    value={frequency}
                    onChange={(val) => setFrequency(val)}
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Delivery Distribution</label>
                  <TextInput placeholder="Emails (comma separated) e.g. admin@setuu.com" />
                </div>
                
                <button className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-elevation-l1 mt-2">
                  Save Schedule
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Recent Exports Panel */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-outline-variant flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface">Recent Exports</h2>
              <button className="text-sm font-semibold text-primary hover:underline">View All</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <DataTable 
                data={exportsData}
                columns={columns}
                getRowId={(row: any) => row.id}
              />
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
