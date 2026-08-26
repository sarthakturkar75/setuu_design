"use client";

import React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SeverityIndicator } from "@/components/ui/SeverityIndicator";
import { Link2Icon, FileTextIcon, AlertTriangleIcon } from "lucide-react";

export function RequirementTraceabilityMatrix({
    requirements,
}: {
    requirements: any[];
}) {
    const columns = [
        {
            key: "display_id",
            header: "SRS ID",
            cell: (row: any) => (
                <span className="font-mono text-xs font-bold text-primary">
                    {row.display_id || row.id.substring(0, 6)}
                </span>
            ),
        },
        {
            key: "title",
            header: "Requirement",
            cell: (row: any) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-on-surface line-clamp-1">
                        {row.title}
                    </span>
                    <span className="text-xs text-on-surface-variant truncate max-w-xs">
                        {row.specification_value || row.description}
                    </span>
                </div>
            ),
        },
        {
            key: "category",
            header: "Category",
            cell: (row: any) => (
                <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                    {row.category || "--"}
                </span>
            ),
        },
        {
            key: "priority",
            header: "Priority",
            cell: (row: any) => <SeverityIndicator level={row.priority} />,
        },
        {
            key: "responsible",
            header: "Responsible",
            cell: (row: any) => (
                <span className="text-sm font-medium">
                    {row.responsible?.display_name || "Unassigned"}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            cell: (row: any) => (
                <StatusBadge
                    label={row.status}
                    tone={
                        row.status === "Verified"
                            ? "emerald"
                            : row.status === "Draft"
                                ? "slate"
                                : "amber"
                    }
                />
            ),
        },
        {
            key: "traceability",
            header: "Trace Links",
            cell: (row: any) => (
                <div className="flex items-center gap-2">
                    {/* Visual indicators mapping requirements to execution phases */}
                    <button
                        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Linked Submittals"
                    >
                        <FileTextIcon className="w-4 h-4" />
                    </button>
                    <button
                        className="p-1.5 text-on-surface-variant hover:text-semantic-amber hover:bg-semantic-amber/10 rounded transition-colors"
                        title="Linked QA Issues"
                    >
                        <AlertTriangleIcon className="w-4 h-4" />
                    </button>
                    <button
                        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Link to Task"
                    >
                        <Link2Icon className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    if (!requirements || requirements.length === 0) {
        return (
            <div className="p-12 text-center text-on-surface-variant border border-dashed border-outline-variant/50 rounded-xl bg-surface-variant/10">
                No Requirements specified for this project.
            </div>
        );
    }

    return (
        <div className="bg-surface border border-outline-variant/50 rounded-xl overflow-hidden flex-1 flex flex-col min-h-[400px]">
            <DataTable
                data={requirements}
                columns={columns}
                getRowId={(r: any) => r.id}
            />
        </div>
    );
}
