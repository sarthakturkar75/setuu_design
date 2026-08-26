"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { RequirementTraceabilityMatrix } from "@/components/ui/RequirementTraceabilityMatrix";
import { useToast } from "@/contexts/ToastContext";
import { getProjectRequirements } from "@/app/actions/requirementActions";
import { PlusIcon, FileSpreadsheetIcon } from "lucide-react";

export default function RequirementsConsolePage() {
    const params = useParams();
    const projectId = params?.id as string;
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
        if (projectId) fetchRequirements();
    }, [projectId, fetchRequirements]);

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
            <PageHeader
                title="Systems Requirement Specification (SRS)"
                subtitle="Manage the engineering traceability matrix. Map requirements to physical submittals and defect logs."
                actions={
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => toast.info("Excel Import triggered...")}
                        >
                            <FileSpreadsheetIcon className="w-4 h-4 mr-2" /> Import SRS Matrix
                        </Button>
                        <Button variant="primary">
                            <PlusIcon className="w-4 h-4 mr-2" /> New Requirement
                        </Button>
                    </div>
                }
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-on-surface-variant animate-pulse">
                        Loading Traceability Matrix...
                    </div>
                ) : (
                    <RequirementTraceabilityMatrix requirements={requirements} />
                )}
            </div>
        </div>
    );
}
