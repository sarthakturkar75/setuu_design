"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getTimelineData } from "@/app/actions/timelineActions";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function ClientProjectTimeline({ params }: { params: { id: string } }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTimelineData(params.id);
        setTasks(data.tasks || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  const columns = [
    { key: "title", header: "Task", cell: (r: any) => <span className="font-medium text-on-surface">{r.title}</span> },
    { key: "status", header: "Status", cell: (r: any) => {
        let tone: any = "slate";
        if (r.status === 'Completed') tone = "emerald";
        if (r.status === 'In Progress') tone = "sky";
        if (r.status === 'Verification') tone = "amber";
        return <StatusBadge tone={tone} label={r.status || "Pending"} />;
      }
    },
    { key: "planned_finish", header: "Est. Finish", cell: (r: any) => r.planned_finish_date ? new Date(r.planned_finish_date).toLocaleDateString() : "—" },
    { key: "completion", header: "Completion", cell: (r: any) => (
      <div className="w-full bg-surface-variant rounded-full h-2 mt-1">
        <div className="bg-primary h-2 rounded-full" style={{ width: `${r.percent_complete || 0}%` }}></div>
      </div>
    )}
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Project Timeline" subtitle="High-level project schedule and task completion tracking." />
      <Card className="p-0 overflow-hidden">
        <DataTable columns={columns} data={tasks} isLoading={loading} />
      </Card>
    </div>
  );
}
