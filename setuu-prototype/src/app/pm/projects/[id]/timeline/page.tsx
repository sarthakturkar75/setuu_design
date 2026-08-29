"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { GanttChartRenderer } from "@/components/ui/GanttChartRenderer";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/contexts/ToastContext";
import { createClient } from "@/lib/supabase/client";
import { levelProjectTimeline } from "@/app/actions/timelineLeveling";
import {
  GanttChartIcon,
  TableIcon,
  ActivityIcon,
  FileSpreadsheetIcon,
} from "lucide-react";

export default function TimelineAndVarianceConsole() {
  const params = useParams();
  const projectId = params?.id as string;
  const [tasks, setTasks] = useState<any[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"gantt" | "variance">("variance");
  const [actionLoading, setActionLoading] = useState("");
  const toast = useToast();
  const supabase = createClient();

  const fetchTasks = React.useCallback(async () => {
    setLoading(true);
    // Fetch the real quantitative execution tasks from Phase 1
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("planned_start_date", { ascending: true });

    if (error) toast.error(error.message);
    else setTasks(data || []);
    setLoading(false);
  }, [projectId, toast, supabase]);

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId, fetchTasks]);

  const handleAutoLevel = async () => {
    setActionLoading("leveling");
    const res = await levelProjectTimeline(projectId);
    if (res.success) {
      toast.success(res.message || "Timeline Leveled");
      await fetchTasks();
    } else {
      toast.error(res.error || "Failed to level timeline.");
    }
    setActionLoading("");
  };

  const handleExportSync = async () => {
    setActionLoading("exporting");
    try {
      window.location.href = `/api/sync/export?projectId=${projectId}`;
      toast.success("Excel generation started.");
    } catch (err: any) {
      toast.error("Export failed: " + err.message);
    }
    setActionLoading("");
  };

  // Maps perfectly to the "Tracking" Excel Sheet format
  const varianceColumns = [
    {
      key: "display_id",
      header: "Task ID",
      cell: (row: any) => (
        <span className="font-mono text-xs">
          {row.display_id || row.id.substring(0, 6)}
        </span>
      ),
    },
    {
      key: "title",
      header: "Activity",
      cell: (row: any) => (
        <span className="font-semibold text-on-surface">{row.title}</span>
      ),
    },
    {
      key: "planned_percent",
      header: "Planned %",
      cell: (row: any) => (
        <span className="text-on-surface-variant">
          {row.planned_percent_complete || 0}%
        </span>
      ),
    },
    {
      key: "actual_percent",
      header: "Actual %",
      cell: (row: any) => (
        <span className="font-bold text-primary">
          {row.actual_percent_complete || 0}%
        </span>
      ),
    },
    {
      key: "variance",
      header: "Variance",
      cell: (row: any) => {
        const v =
          (row.actual_percent_complete || 0) -
          (row.planned_percent_complete || 0);
        return (
          <span
            className={`font-bold ${v < 0 ? "text-semantic-crimson" : v > 0 ? "text-semantic-emerald" : "text-on-surface-variant"}`}
          >
            {v > 0 ? `+${v}` : v}%
          </span>
        );
      },
    },
    {
      key: "planned_finish",
      header: "Planned Finish",
      cell: (row: any) => (
        <span className="text-sm">
          {row.planned_finish_date
            ? new Date(row.planned_finish_date).toLocaleDateString()
            : "--"}
        </span>
      ),
    },
    {
      key: "actual_finish",
      header: "Actual Finish",
      cell: (row: any) => (
        <span className="text-sm">
          {row.actual_finish_date
            ? new Date(row.actual_finish_date).toLocaleDateString()
            : "--"}
        </span>
      ),
    },
    {
      key: "delay_days",
      header: "Delay Days",
      cell: (row: any) => {
        const delay = row.delay_days || 0;
        return (
          <span
            className={`font-mono text-sm ${delay > 0 ? "text-semantic-crimson font-bold bg-semantic-crimson/10 px-2 py-0.5 rounded" : "text-on-surface-variant"}`}
          >
            {delay > 0 ? `+${delay}` : delay}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (row: any) => {
        const statusStr = row.status || "pending"; 
        const label = statusStr === "completed" ? "Completed" : statusStr === "in_progress" ? "In Progress" : "Pending"; 
        const tone = statusStr === "completed" ? "emerald" : statusStr === "in_progress" ? "sky" : "slate"; 
        return <StatusBadge label={label} tone={tone} />;
      },
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold font-merriweather text-on-surface flex items-center gap-2">
            Schedule & Variance Tracking
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Monitor EVM deviations, baseline lifecycles, and auto-level critical
            paths.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-surface-variant/50 p-1 rounded-lg border border-outline-variant/30">
            <button
              onClick={() => setView("variance")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors flex items-center gap-2 ${view === "variance" ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              <TableIcon className="w-4 h-4" /> Tracking Table
            </button>
            <button
              onClick={() => setView("gantt")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors flex items-center gap-2 ${view === "gantt" ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              <GanttChartIcon className="w-4 h-4" /> Gantt View
            </button>
          </div>
          <Button
            variant="outline"
            onClick={handleExportSync}
            disabled={!!actionLoading}
          >
            <FileSpreadsheetIcon className="w-4 h-4 mr-2 text-semantic-emerald" />{" "}
            {actionLoading === "exporting" ? "Exporting..." : "Export to Excel"}
          </Button>
          <Button
            variant="primary"
            onClick={handleAutoLevel}
            disabled={!!actionLoading || loading}
          >
            <ActivityIcon className="w-4 h-4 mr-2" />{" "}
            {actionLoading === "leveling"
              ? "Leveling..."
              : "Auto-Level Dependencies"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-surface rounded-xl border border-outline-variant/50 shadow-sm">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant animate-pulse">
            Loading execution data...
          </div>
        ) : view === "gantt" ? (
          <GanttChartRenderer tasks={tasks} />
        ) : (
          <DataTable
            data={tasks}
            columns={varianceColumns}
            getRowId={(r: any) => r.id}
          />
        )}
      </div>
    </div>
  );
}
