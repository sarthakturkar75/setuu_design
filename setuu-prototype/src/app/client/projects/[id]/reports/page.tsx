"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getProjectReports } from "@/app/actions/reportActions";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { DownloadIcon, FileTextIcon } from "lucide-react";

export default function ClientProjectReports({ params }: { params: { id: string } }) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProjectReports();
        // Client-side filter for now
        const projReports = data.filter(r => r.project_id === params.id);
        setReports(projReports);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  const columns = [
    { key: "title", header: "Report Name", cell: (r: any) => (
      <div className="flex items-center gap-2">
        <FileTextIcon className="w-4 h-4 text-outline" />
        <span className="font-medium text-on-surface">{r.title}</span>
      </div>
    )},
    { key: "type", header: "Type", cell: (r: any) => <span className="capitalize">{r.report_type || 'Status Report'}</span> },
    { key: "generated", header: "Generated On", cell: (r: any) => new Date(r.generated_at).toLocaleDateString() },
    { key: "actions", header: "", cell: (r: any) => (
      <a href={`/api/reports/download/${r.project_id}`} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm">
          <DownloadIcon className="w-4 h-4 mr-2" /> Download PDF
        </Button>
      </a>
    )}
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Project Reports" subtitle="View and download formal project reports." />
      <Card className="p-0 overflow-hidden">
        <DataTable columns={columns} data={reports} isLoading={loading} />
      </Card>
    </div>
  );
}
