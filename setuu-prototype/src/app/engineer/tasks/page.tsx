"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { getAssignedTasks } from "@/app/actions/timelineActions";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function EngineerTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Pass no project ID to get all assigned tasks across projects
      const data = await getAssignedTasks(); 
      setTasks(data || []);
      setIsLoading(false);
    }
    load();
  }, []);

  const columns = [
    { key: "display_id", header: "Task ID", cell: (row: any) => row.display_id || "—" },
    { key: "title", header: "Title", cell: (row: any) => row.title },
    { key: "status", header: "Status", cell: (row: any) => <StatusBadge tone={row.status === "completed" ? "emerald" : "slate"} label={row.status} /> },
    { key: "priority", header: "Priority", cell: (row: any) => <span className="capitalize">{row.priority}</span> },
    { key: "due_date", header: "Due Date", cell: (row: any) => row.planned_finish_date ? new Date(row.planned_finish_date).toLocaleDateString() : "—" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="My Assigned Tasks" subtitle="Track and update your execution tasks across all projects." />
      <Card className="p-0 overflow-hidden">
        <DataTable columns={columns} data={tasks} isLoading={isLoading} />
      </Card>
    </div>
  );
}
