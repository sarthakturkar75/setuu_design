"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PackageIcon, Loader2 } from "lucide-react";
import { getMaterials } from "@/app/actions/materialActions";

export default function GlobalMaterialsPage() {
    const [materials, setMaterials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadMaterials() {
            setIsLoading(true);
            try {
                // Fetch all materials across ALL projects (no ID passed)
                const data = await getMaterials();
                setMaterials(data || []);
            } catch (error) {
                console.error("Failed to load materials:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadMaterials();
    }, []);

    const columns = [
        {
            key: "id",
            header: "ID",
            cell: (row: any) => (
                <span className="font-jetbrains-mono text-xs text-outline">
                    {row.id.substring(0, 8)}
                </span>
            ),
        },
        {
            key: "name",
            header: "Material",
            cell: (row: any) => (
                <span className="font-medium text-on-surface">{row.name}</span>
            ),
        },
        {
            key: "project",
            header: "Project",
            cell: (row: any) => (
                <span className="text-sm text-on-surface-variant font-medium">
                    {row.project_name || "Unknown"}
                </span>
            ),
        },
        {
            key: "po_number",
            header: "PO Reference",
            cell: (row: any) => (
                <span className="text-sm font-jetbrains-mono text-on-surface-variant">
                    {row.po_number || "N/A"}
                </span>
            ),
        },
        {
            key: "supplier",
            header: "Supplier",
            cell: (row: any) => (
                <span className="text-sm text-on-surface-variant">
                    {row.supplier || "Unknown"}
                </span>
            ),
        },
        {
            key: "delivery",
            header: "Expected Delivery",
            cell: (row: any) => (
                <span className="text-sm text-on-surface-variant">
                    {row.expected_delivery
                        ? new Date(row.expected_delivery).toLocaleDateString()
                        : "TBD"}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            cell: (row: any) => {
                let tone: "emerald" | "amber" | "crimson" | "sky" | "neutral" = "amber";
                if (row.status === "Delivered") tone = "emerald";
                if (row.status === "Delayed") tone = "crimson";
                if (row.status === "Ordered") tone = "sky";
                return <StatusBadge tone={tone} label={row.status} />;
            },
        },
    ];

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader
                    title="Master Material Tracking"
                    subtitle="Track and manage all purchase orders and material deliveries across your projects."
                />
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors">
                    <PackageIcon className="w-4 h-4" />
                    Export Log
                </button>
            </div>

            <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full min-h-[400px]">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : materials.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-on-surface-variant">
                        <PackageIcon className="w-12 h-12 mb-4 opacity-50" />
                        <p>No materials tracked yet.</p>
                    </div>
                ) : (
                    <DataTable data={materials} columns={columns} />
                )}
            </div>
        </div>
    );
}