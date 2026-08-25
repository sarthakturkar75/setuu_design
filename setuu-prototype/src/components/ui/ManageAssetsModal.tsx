"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, BoxIcon, QrCodeIcon } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import {
    getProjectAssets,
    createProjectAsset,
    deleteProjectAsset,
} from "@/app/actions/handoverActions";

export function ManageAssetsModal({
    projectId,
    onClose,
}: {
    projectId: string;
    onClose: () => void;
}) {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const toast = useToast();

    const fetchAssets = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = await getProjectAssets(projectId);
            setAssets(data);
        } catch (e: any) {
            toast.error("Failed to load assets: " + e.message);
        }
        setLoading(false);
    }, [projectId, toast]);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    const handleAddAsset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAdding(true);

        // Safely capture form reference before any async calls
        const formElement = e.currentTarget;
        const fd = new FormData(formElement);
        fd.append("project_id", projectId);

        const res = await createProjectAsset(fd);
        if (res.success) {
            toast.success("Physical asset registered successfully.");
            formElement.reset(); // Safe reset
            await fetchAssets();
        } else {
            toast.error(res.error || "Failed to add asset.");
        }
        setAdding(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this asset from the handover registry?")) return;
        const res = await deleteProjectAsset(id, projectId);
        if (res.success) {
            toast.success("Asset removed.");
            await fetchAssets();
        } else {
            toast.error(res.error || "Failed to delete.");
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-surface-container-lowest w-full max-w-4xl rounded-xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/30 max-h-[85vh]">
                <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface">
                    <div>
                        <h2 className="text-xl font-bold text-on-surface font-merriweather flex items-center gap-2">
                            <BoxIcon className="w-5 h-5 text-primary" /> Manage Physical
                            Assets
                        </h2>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                            Register equipment here to include them in the O&M manual and
                            generate QR codes.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-surface-variant rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    {/* Add Asset Form */}
                    <div className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-outline-variant/50 bg-surface-variant/10 flex flex-col">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4">
                            Register New Asset
                        </h3>
                        <form onSubmit={handleAddAsset} className="space-y-4 flex-1">
                            <div>
                                <label className="text-xs font-semibold text-on-surface">
                                    Equipment Name
                                </label>
                                <input
                                    required
                                    name="name"
                                    placeholder="e.g. Carrier HVAC Unit"
                                    className="w-full mt-1 p-2 bg-surface border border-outline-variant rounded-lg text-sm outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-on-surface">
                                    Asset Tag (ID)
                                </label>
                                <input
                                    required
                                    name="asset_tag"
                                    placeholder="e.g. HVAC-001"
                                    className="w-full mt-1 p-2 bg-surface border border-outline-variant rounded-lg text-sm outline-none focus:border-primary font-mono uppercase"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-on-surface">
                                    Warranty End Date
                                </label>
                                <input
                                    type="date"
                                    name="warranty_end"
                                    className="w-full mt-1 p-2 bg-surface border border-outline-variant rounded-lg text-sm outline-none focus:border-primary"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={adding}
                                className="w-full py-2 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:bg-primary/90 flex items-center justify-center gap-2 mt-4"
                            >
                                <Plus className="w-4 h-4" />{" "}
                                {adding ? "Saving..." : "Add to Registry"}
                            </button>
                        </form>
                    </div>

                    {/* Asset List */}
                    <div className="w-full md:w-2/3 p-6 overflow-y-auto bg-surface">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center justify-between">
                            Registered Assets
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">
                                {assets.length} Total
                            </span>
                        </h3>

                        {loading ? (
                            <p className="text-sm text-on-surface-variant animate-pulse">
                                Loading registry...
                            </p>
                        ) : assets.length === 0 ? (
                            <div className="p-8 text-center border border-dashed border-outline-variant rounded-xl bg-surface-variant/10">
                                <QrCodeIcon className="w-8 h-8 text-on-surface-variant mx-auto mb-2 opacity-50" />
                                <p className="text-sm text-on-surface font-semibold">
                                    Registry is empty
                                </p>
                                <p className="text-xs text-on-surface-variant">
                                    Add physical equipment to generate asset QR tags during
                                    handover.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {assets.map((asset) => (
                                    <div
                                        key={asset.id}
                                        className="flex justify-between items-center p-3 border border-outline-variant/50 rounded-lg hover:border-primary/30 transition-colors bg-surface-container-lowest shadow-sm"
                                    >
                                        <div>
                                            <p className="font-semibold text-on-surface text-sm">
                                                {asset.name}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-mono bg-surface-variant px-1.5 py-0.5 rounded text-on-surface-variant">
                                                    {asset.asset_tag}
                                                </span>
                                                {asset.warranty_end && (
                                                    <span className="text-[10px] text-semantic-emerald font-semibold border border-semantic-emerald/20 px-1.5 py-0.5 rounded">
                                                        Warranty:{" "}
                                                        {new Date(asset.warranty_end).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(asset.id)}
                                            className="p-2 text-semantic-crimson hover:bg-semantic-crimson/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
