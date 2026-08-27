"use client";

import React, { useEffect, useState, use } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { RequirementTraceabilityMatrix } from "@/components/ui/RequirementTraceabilityMatrix";
import { useToast } from "@/contexts/ToastContext";
import { getProjectRequirements } from "@/app/actions/requirementActions";

export default function EngineerRequirementsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = use(params);
    const [requirements, setRequirements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const fetchRequirements = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = await getProjectRequirements(projectId);
            setRequirements(data);
        } catch (e: any) {
            toast.error(e.message || "Failed to load requirements.");
        }
        setLoading(false);
    }, [projectId, toast]);

    useEffect(() => {
        fetchRequirements();
    }, [fetchRequirements]);

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-100px)] flex flex-col">
            <PageHeader
                title="Requirements Verification"
                subtitle="Review SRS specifications and toggle status to Verified upon successful test completion."
            />

            <div className="flex-1 flex flex-col overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-on-surface-variant animate-pulse bg-surface rounded-xl border border-outline-variant/30">
                        Loading Verification Matrix...
                    </div>
                ) : (
                    <RequirementTraceabilityMatrix
                        requirements={requirements}
                        projectId={projectId}
                        userRole="engineer"
                        onUpdate={fetchRequirements}
                    />
                )}
            </div>
        </div>
    );
}