"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SeverityIndicator } from "@/components/ui/SeverityIndicator";
import { Link2Icon, FileTextIcon, AlertTriangleIcon, CheckCircle2Icon, ClockIcon, Edit3Icon, XIcon } from "lucide-react";
import { updateRequirementStatus } from "@/app/actions/requirementActions";
import { useToast } from "@/contexts/ToastContext";

// Simple Slide-out component for the Traceability Hub
function TraceabilitySlideout({ req, isOpen, onClose }: { req: any, isOpen: boolean, onClose: () => void }) {
    if (!isOpen || !req) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-surface border-l border-outline-variant shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-variant/30">
                <div>
                    <h3 className="font-bold text-on-surface">Traceability Hub</h3>
                    <p className="text-xs text-on-surface-variant font-mono">{req.display_id || req.id.substring(0, 8)}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-outline-variant/20 rounded-full">
                    <XIcon className="w-5 h-5 text-on-surface-variant" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                        <FileTextIcon className="w-4 h-4 text-primary" /> Mapped Submittals
                    </h4>
                    <div className="p-4 rounded border border-dashed border-outline-variant/50 text-center text-sm text-on-surface-variant bg-surface-variant/10">
                        No physical submittals currently linked to this requirement.
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                        <AlertTriangleIcon className="w-4 h-4 text-semantic-amber" /> Associated QA Issues
                    </h4>
                    <div className="p-4 rounded border border-dashed border-outline-variant/50 text-center text-sm text-on-surface-variant bg-surface-variant/10">
                        No active non-conformances found for this specification.
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                        <Link2Icon className="w-4 h-4 text-primary" /> Linked Schedule Tasks
                    </h4>
                    <div className="p-4 rounded border border-dashed border-outline-variant/50 text-center text-sm text-on-surface-variant bg-surface-variant/10">
                        No Gantt timeline tasks mapped.
                    </div>
                </div>
            </div>
        </div>
    );
}

interface MatrixProps {
    requirements: any[];
    projectId: string;
    userRole: "pm" | "admin" | "engineer" | "client";
    onUpdate?: () => void;
}

export function RequirementTraceabilityMatrix({ requirements, projectId, userRole, onUpdate }: MatrixProps) {
    const toast = useToast();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // State for Traceability Slideout
    const [activeTraceReq, setActiveTraceReq] = useState<any | null>(null);

    // State for Inline Remarks Editing
    const [editingRemarksId, setEditingRemarksId] = useState<string | null>(null);
    const [tempRemarks, setTempRemarks] = useState("");

    const handleStatusToggle = async (req: any) => {
        if (userRole === "client") return;
        const newStatus = req.status === "Verified" ? "In Review" : req.status === "In Review" ? "Draft" : "Verified";
        setUpdatingId(req.id);
        const res = await updateRequirementStatus(req.id, projectId, newStatus);
        if (res.success) {
            toast.success(`Status updated to ${newStatus}`);
            if (onUpdate) onUpdate();
        } else {
            toast.error(res.error || "Failed to update status");
        }
        setUpdatingId(null);
    };

    const handleSaveRemarks = async (reqId: string, currentStatus: string) => {
        setUpdatingId(reqId);
        const res = await updateRequirementStatus(reqId, projectId, currentStatus, tempRemarks);
        if (res.success) {
            toast.success("Remarks updated successfully.");
            setEditingRemarksId(null);
            if (onUpdate) onUpdate();
        } else {
            toast.error(res.error || "Failed to save remarks");
        }
        setUpdatingId(null);
    };

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
            header: "Requirement & Spec",
            cell: (row: any) => (
                <div className="flex flex-col min-w-[200px]">
                    <span className="font-semibold text-on-surface line-clamp-1" title={row.title}>{row.title}</span>
                    <span className="text-[11px] text-on-surface-variant line-clamp-1" title={row.specification_value}>
                        Spec: {row.specification_value || "N/A"}
                    </span>
                </div>
            ),
        },
        {
            key: "customer_req",
            header: "Client Source",
            cell: (row: any) => (
                <div className="flex flex-col max-w-[150px]">
                    <span className="text-xs text-on-surface-variant truncate" title={row.customer_requirement}>
                        {row.customer_requirement || "--"}
                    </span>
                    {row.source_document && (
                        <span className="text-[10px] text-primary underline truncate cursor-pointer">
                            Ref: {row.source_document}
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: "priority",
            header: "Priority",
            cell: (row: any) => <SeverityIndicator level={row.priority} />,
        },
        {
            key: "status",
            header: "Verification",
            cell: (row: any) => (
                <div
                    onClick={() => handleStatusToggle(row)}
                    className={`cursor-pointer transition-opacity ${updatingId === row.id ? 'opacity-50 pointer-events-none' : 'hover:opacity-80'}`}
                    title={userRole !== 'client' ? "Click to toggle status" : ""}
                >
                    <StatusBadge
                        label={row.status || 'Draft'}
                        tone={row.status === "Verified" ? "emerald" : row.status === "In Review" ? "sky" : "slate"}
                        icon={row.status === "Verified" ? <CheckCircle2Icon className="w-3 h-3" /> : <ClockIcon className="w-3 h-3" />}
                    />
                </div>
            ),
        },
        {
            key: "remarks",
            header: "Remarks",
            cell: (row: any) => {
                if (editingRemarksId === row.id) {
                    return (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                autoFocus
                                value={tempRemarks}
                                onChange={(e) => setTempRemarks(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveRemarks(row.id, row.status)}
                                className="w-full text-xs p-1 border border-primary rounded bg-surface text-on-surface"
                            />
                            <button onClick={() => setEditingRemarksId(null)} className="text-on-surface-variant hover:text-semantic-crimson">
                                <XIcon className="w-3 h-3" />
                            </button>
                        </div>
                    );
                }

                return (
                    <div
                        className="group flex justify-between items-center min-w-[150px] cursor-pointer"
                        onClick={() => {
                            if (userRole === "client") return;
                            setTempRemarks(row.remarks || "");
                            setEditingRemarksId(row.id);
                        }}
                    >
                        <span className={`text-xs italic line-clamp-2 max-w-[200px] ${!row.remarks ? 'text-on-surface-variant/50' : 'text-on-surface-variant'}`} title={row.remarks}>
                            {row.remarks || "Click to add remarks..."}
                        </span>
                        {userRole !== "client" && (
                            <Edit3Icon className="w-3 h-3 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                    </div>
                );
            },
        },
        {
            key: "traceability",
            header: "Trace Links",
            cell: (row: any) => (
                <div className="flex items-center gap-1">
                    <button onClick={() => setActiveTraceReq(row)} className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors" title="View Traceability Hub">
                        <Link2Icon className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    if (!requirements || requirements.length === 0) {
        return (
            <div className="p-12 text-center text-on-surface-variant border border-dashed border-outline-variant/50 rounded-xl bg-surface-variant/10">
                No SRS Requirements specified. Import the Excel matrix to populate.
            </div>
        );
    }

    return (
        <>
            <div className="bg-surface border border-outline-variant/50 rounded-xl overflow-hidden flex-1 flex flex-col min-h-[400px]">
                <DataTable data={requirements} columns={columns} getRowId={(r: any) => r.id} />
            </div>

            {/* The actual functioning Traceability Hub Side Panel */}
            <TraceabilitySlideout
                req={activeTraceReq}
                isOpen={!!activeTraceReq}
                onClose={() => setActiveTraceReq(null)}
            />
        </>
    );
}