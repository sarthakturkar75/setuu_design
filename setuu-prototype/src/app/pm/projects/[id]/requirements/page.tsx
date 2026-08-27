"use client";

import React, { useEffect, useState, useRef, use } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { RequirementTraceabilityMatrix } from "@/components/ui/RequirementTraceabilityMatrix";
import { CreateRequirementModal } from "@/components/ui/CreateRequirementModal";
import { useToast } from "@/contexts/ToastContext";
import { getProjectRequirements } from "@/app/actions/requirementActions";
import { PlusIcon, FileSpreadsheetIcon, DownloadIcon, Loader2Icon } from "lucide-react";

export default function PMRequirementsConsolePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = use(params);
    const [requirements, setRequirements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [isUploading, setIsUploading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
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

    // 1. REAL FUNCTION: Import SRS Matrix
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", projectId);

        try {
            toast.info("Uploading and parsing Excel matrix...");
            const res = await fetch("/api/sync/excel", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to sync Excel file");

            toast.success("Excel Matrix successfully synchronized!");
            await fetchRequirements();
        } catch (error: any) {
            toast.error(error.message || "An error occurred during upload.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // 2. REAL FUNCTION: Export to Excel
    const handleExport = async () => {
        setIsExporting(true);
        try {
            toast.info("Generating secure Excel file...");
            const res = await fetch(`/api/sync/export?projectId=${projectId}&type=srs`, { method: "GET" });

            if (!res.ok) throw new Error("Export generation failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `SRS_Matrix_${projectId.substring(0, 6)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success("Export downloaded successfully.");
        } catch (error: any) {
            toast.error(error.message || "Failed to generate export.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-100px)] flex flex-col">
            <PageHeader
                title="Systems Requirement Specification (SRS)"
                subtitle="Manage the engineering traceability matrix. Map requirements to physical submittals and defect logs."
                actions={
                    <div className="flex gap-3">
                        {/* REAL BUTTON 1: Export */}
                        <Button variant="outline" onClick={handleExport} disabled={isExporting || requirements.length === 0}>
                            {isExporting ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <DownloadIcon className="w-4 h-4 mr-2" />}
                            {isExporting ? "Exporting..." : "Export to Excel"}
                        </Button>

                        {/* REAL BUTTON 2: Import */}
                        <input type="file" accept=".xlsx, .csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                            {isUploading ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <FileSpreadsheetIcon className="w-4 h-4 mr-2" />}
                            {isUploading ? "Syncing..." : "Import SRS Matrix"}
                        </Button>

                        {/* REAL BUTTON 3: New Requirement */}
                        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                            <PlusIcon className="w-4 h-4 mr-2" /> New Requirement
                        </Button>
                    </div>
                }
            />

            <div className="flex-1 flex flex-col overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-on-surface-variant animate-pulse bg-surface rounded-xl border border-outline-variant/30">
                        Loading Traceability Matrix...
                    </div>
                ) : (
                    <RequirementTraceabilityMatrix
                        requirements={requirements}
                        projectId={projectId}
                        userRole="pm"
                        onUpdate={fetchRequirements}
                    />
                )}
            </div>

            {/* REAL MODAL */}
            <CreateRequirementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectId={projectId}
                onSuccess={fetchRequirements}
            />
        </div>
    );
}