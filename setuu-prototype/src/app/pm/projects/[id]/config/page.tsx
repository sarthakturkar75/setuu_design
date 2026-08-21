"use client";

import { useToast } from "@/contexts/ToastContext";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Save, LifeBuoy, Loader2 } from "lucide-react";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import {
    getProjects,
    getProjectById,
    updateProjectConfig,
} from "@/app/actions/projectActions";

export default function PMProjectConfigPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
  const toast = useToast();

    const { id } = use(params);

    const [projects, setProjects] = useState<any[]>([]);
    const [currentProject, setCurrentProject] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const [allProjects, projectData] = await Promise.all([
                    getProjects(),
                    getProjectById(id),
                ]);
                setProjects(allProjects || []);
                setCurrentProject(projectData);
            } catch (error) {
                console.error("Failed to fetch project data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [id]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData(e.currentTarget);
        formData.append("id", id);

        // We no longer manually append status here, because we added a dropdown for it!

        try {
            const result = await updateProjectConfig(formData);
            if (result.success) {
                toast.success("Project configuration updated!");
            } else {
                toast.error(`Failed to update: ${result.error}`);
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSaving(false);
        }
    }

    const formattedTargetDate = currentProject?.target_date
        ? new Date(currentProject.target_date).toISOString().split("T")[0]
        : "";

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!currentProject) {
        return <div className="p-6 text-center">Project not found.</div>;
    }

    return (
        <div className="flex flex-col lg:flex-row h-full max-w-[1600px] mx-auto p-6 gap-6">
            {/* Sidebar Selector - Scoped to /pm/ routing */}
            <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
                <h3 className="font-merriweather font-bold text-on-surface">
                    Active Projects
                </h3>
                <div className="space-y-2">
                    {projects.map((p) => (
                        <Link
                            key={p.id}
                            href={`/pm/projects/${p.id}/config`}
                            className={`block p-3 rounded-lg border transition-colors ${p.id === id
                                ? "bg-primary/5 border-primary"
                                : "bg-surface border-outline-variant hover:bg-surface-variant"
                                }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span
                                    className={`font-semibold text-sm ${p.id === id ? "text-primary" : "text-on-surface truncate pr-2"}`}
                                >
                                    {p.name}
                                </span>
                                <StatusBadge tone={p.status as any} label={p.status} />
                            </div>
                            <span className="text-xs font-jetbrains text-on-surface-variant">
                                {p.id.substring(0, 8)}...
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
                <Card className="p-6">
                    <h3 className="font-merriweather text-lg font-bold text-on-surface mb-6">
                        Project Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Project Name *">
                            <TextInput
                                name="name"
                                defaultValue={currentProject.name}
                                required
                            />
                        </FormField>

                        <FormField label="Project Status">
                            <Select
                                name="status"
                                options={[
                                    { label: "Not Started", value: "Not Started" },
                                    { label: "In Progress", value: "In Progress" },
                                    { label: "On Hold", value: "On Hold" },
                                    { label: "Completed", value: "Completed" },
                                ]}
                                defaultValue={currentProject.status || "Not Started"}
                                onChange={() => { }}
                            />
                        </FormField>

                        <FormField label="PO Reference">
                            <TextInput
                                name="po_reference"
                                defaultValue={currentProject.po_reference || ""}
                            />
                        </FormField>

                        <FormField label="Contract Value">
                            <TextInput
                                name="contract_value"
                                type="number"
                                defaultValue={currentProject.contract_value || ""}
                            />
                        </FormField>

                        <div className="md:col-span-2">
                            <FormField label="Description">
                                <textarea
                                    name="description"
                                    className="w-full px-3 py-2 bg-surface text-on-surface border border-outline rounded-lg focus:outline-none focus:border-primary min-h-[100px]"
                                    defaultValue={currentProject.description || ""}
                                />
                            </FormField>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-merriweather text-lg font-bold text-on-surface mb-6">
                        Timeline & Type
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Target Completion">
                            <TextInput
                                name="target_date"
                                type="date"
                                defaultValue={formattedTargetDate}
                            />
                        </FormField>

                        <FormField label="Project Type">
                            <Select
                                name="type"
                                options={[
                                    { label: "General", value: "General" },
                                    { label: "Mechanical", value: "Mechanical" },
                                    { label: "Electrical", value: "Electrical" },
                                ]}
                                defaultValue={currentProject.type || "General"}
                                onChange={() => { }}
                            />
                        </FormField>
                    </div>
                </Card>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg font-semibold hover:bg-surface-variant"
                    >
                        <LifeBuoy className="w-4 h-4" /> Raise Ticket
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? "Saving..." : "Save Configuration"}
                    </button>
                </div>
            </form>
        </div>
    );
}