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
import { GanttChartIcon, TableIcon, ActivityIcon, FileSpreadsheetIcon, AlertOctagon, Edit3Icon, XIcon, CheckIcon } from "lucide-react";
import { PlusIcon } from "lucide-react";
import { CreateTaskModal } from "@/components/ui/CreateTaskModal";

export default function TimelineAndVarianceConsole() {
  const params = useParams();
  const projectId = params?.id as string;
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"gantt" | "variance">("variance");
  const [actionLoading, setActionLoading] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inline Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempPercent, setTempPercent] = useState<number>(0);
  const [tempBlocker, setTempBlocker] = useState<string>("");

  const toast = useToast();
  const supabase = createClient();

  const fetchTasks = React.useCallback(async () => {
    setLoading(true);
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
      window.location.href = `/api/sync/export?projectId=${projectId}&type=planning`;
      toast.success("Excel generation started.");
    } catch (err: any) {
      toast.error("Export failed: " + err.message);
    }
    setActionLoading("");
  };

  // Inline Database Mutation
  const saveTaskUpdate = async (id: string, currentBlockers: string[] = []) => {
    try {
      let updatedBlockers = [...(currentBlockers || [])];
      if (tempBlocker.trim() !== "") {
        updatedBlockers.push(tempBlocker.trim());
      }

      const { error } = await supabase
        .from("tasks")
        .update({
          actual_percent_complete: tempPercent,
          blockers: updatedBlockers
        })
        .eq("id", id);

      if (error) throw new Error(error.message);

      toast.success("Task execution data updated.");
      setEditingId(null);
      await fetchTasks();
    } catch (e: any) {
      toast.error(e.message || "Failed to update task.");
    }
  };

  const clearBlockers = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").update({ blockers: [] }).eq("id", id);
      if (error) throw new Error(error.message);
      toast.success("Blockers cleared.");
      await fetchTasks();
    } catch (e: any) {
      toast.error(e.message || "Failed to clear blockers.");
    }
  };

  const varianceColumns = [
    {
      key: "display_id",
      header: "Task ID",
      cell: (row: any) => <span className="font-mono text-xs text-primary font-bold">{row.display_id || row.id.substring(0, 6)}</span>,
    },
    {
      key: "title",
      header: "Activity",
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface">{row.title}</span>
          <span className="text-[10px] text-on-surface-variant tracking-wider uppercase">{row.department || 'General'}</span>
        </div>
      ),
    },
    {
      key: "planned_percent",
      header: "Plan %",
      cell: (row: any) => <span className="text-on-surface-variant font-mono">{row.planned_percent_complete || 0}%</span>,
    },
    {
      key: "actual_percent",
      header: "Actual %",
      cell: (row: any) => {
        if (editingId === row.id) {
          return (
            <input
              type="number"
              max="100" min="0"
              value={tempPercent}
              onChange={(e) => setTempPercent(parseInt(e.target.value) || 0)}
              className="w-16 p-1 text-xs border border-primary rounded bg-surface text-on-surface font-mono"
            />
          );
        }
        return (
          <div className="group flex items-center gap-2 cursor-pointer" onClick={() => { setEditingId(row.id); setTempPercent(row.actual_percent_complete || 0); setTempBlocker(""); }}>
            <span className="font-bold text-primary font-mono">{row.actual_percent_complete || 0}%</span>
            <Edit3Icon className="w-3 h-3 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        );
      },
    },
    {
      key: "variance",
      header: "EVM Variance",
      cell: (row: any) => {
        const v = (row.actual_percent_complete || 0) - (row.planned_percent_complete || 0);
        return (
          <span className={`font-mono font-bold ${v < 0 ? "text-semantic-crimson" : v > 0 ? "text-semantic-emerald" : "text-on-surface-variant"}`}>
            {v > 0 ? `+${v}` : v}%
          </span>
        );
      },
    },
    {
      key: "blockers",
      header: "Blockers",
      cell: (row: any) => {
        if (editingId === row.id) {
          return (
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Add new blocker..."
                value={tempBlocker}
                onChange={(e) => setTempBlocker(e.target.value)}
                className="w-32 p-1 text-xs border border-semantic-crimson rounded bg-surface text-on-surface"
              />
              <button onClick={() => saveTaskUpdate(row.id, row.blockers)} className="p-1 bg-primary text-on-primary rounded hover:bg-primary/80"><CheckIcon className="w-3 h-3" /></button>
              <button onClick={() => setEditingId(null)} className="p-1 bg-surface-variant text-on-surface rounded hover:bg-outline-variant"><XIcon className="w-3 h-3" /></button>
            </div>
          )
        }

        const hasBlockers = row.blockers && row.blockers.length > 0;
        return hasBlockers ? (
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setEditingId(row.id); setTempPercent(row.actual_percent_complete || 0); setTempBlocker(""); }}>
            <div className="flex items-center gap-1 text-semantic-crimson bg-semantic-crimson/10 px-2 py-0.5 rounded text-xs font-bold w-fit" title={row.blockers.join(", ")}>
              <AlertOctagon className="w-3 h-3" /> {row.blockers.length}
            </div>
            <button onClick={(e) => { e.stopPropagation(); clearBlockers(row.id); }} className="text-[10px] text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-semantic-crimson underline">Clear</button>
          </div>
        ) : (
          <span className="text-on-surface-variant text-xs italic cursor-pointer hover:text-primary" onClick={() => { setEditingId(row.id); setTempPercent(row.actual_percent_complete || 0); setTempBlocker(""); }}>--</span>
        );
      }
    },
    {
      key: "delay_days",
      header: "Delay Days",
      cell: (row: any) => {
        const delay = row.delay_days || 0;
        return (
          <span className={`font-mono text-sm ${delay > 0 ? "text-semantic-crimson font-bold bg-semantic-crimson/10 px-2 py-0.5 rounded" : "text-on-surface-variant"}`}>
            {delay > 0 ? `+${delay}` : delay}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (row: any) => (
        <StatusBadge label={row.status || "Not Started"} tone={row.status === "Completed" ? "emerald" : row.status === "In Progress" ? "sky" : "slate"} />
      ),
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
            Monitor EVM deviations, baseline lifecycles, and auto-level critical paths.
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

          <Button variant="outline" onClick={handleExportSync} disabled={!!actionLoading}>
            <FileSpreadsheetIcon className="w-4 h-4 mr-2 text-semantic-emerald" />{" "}
            {actionLoading === "exporting" ? "Exporting..." : "Export to Excel"}
          </Button>

          <Button variant="primary" onClick={handleAutoLevel} disabled={!!actionLoading || loading}>
            <ActivityIcon className="w-4 h-4 mr-2" />{" "}
            {actionLoading === "leveling" ? "Leveling..." : "Auto-Level Dependencies"}
          </Button>

          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-2" /> New Task
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
          <DataTable data={tasks} columns={varianceColumns} getRowId={(r: any) => r.id} />
        )}
      </div>
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        onSuccess={fetchTasks}
      />
    </div>
  );
}