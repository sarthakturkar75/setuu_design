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
  getProjectConfigOptions // <-- NEW IMPORT
} from "@/app/actions/projectActions";

export default function ProjectConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const toast = useToast();

  const { id } = use(params);

  const [projects, setProjects] = useState<any[]>([]);
  const [currentProject, setCurrentProject] = useState<any>(null);

  // NEW: State to hold our dropdown options
  const [pmOptions, setPmOptions] = useState<{ label: string, value: string }[]>([]);
  const [clientOptions, setClientOptions] = useState<{ label: string, value: string }[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch all required data simultaneously
        const [allProjects, projectData, configOptions] = await Promise.all([
          getProjects(),
          getProjectById(id),
          getProjectConfigOptions() // <-- Fetch our dropdown data
        ]);

        setProjects(allProjects || []);
        setCurrentProject(projectData);

        // Map database records to the { label, value } format the Select component expects
        setPmOptions(configOptions.pms.map(pm => ({ label: pm.display_name, value: pm.id })));
        setClientOptions(configOptions.clients.map(client => ({ label: client.name, value: client.id })));

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
    formData.append("status", currentProject?.status || "Not Started");

    try {
      const result = await updateProjectConfig(formData);
      if (result.success) {
        toast.success("Project configuration saved successfully!");
      } else {
        toast.error(`Failed to save: ${result.error}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  }

  const formattedTargetDate = currentProject?.target_date
    ? new Date(currentProject.target_date).toISOString().split('T')[0]
    : "";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="p-6 text-center text-on-surface-variant">
        Project not found or you do not have permission to view it.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full max-w-[1600px] mx-auto p-6 gap-6">

      {/* Sidebar Selector */}
      <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
        <h3 className="font-merriweather font-bold text-on-surface">Active Projects</h3>
        <div className="space-y-2">
          {projects.map(p => (
            <Link
              key={p.id}
              href={`/admin/projects/${p.id}/config`}
              className={`block p-3 rounded-lg border transition-colors ${p.id === id
                ? "bg-primary/5 border-primary"
                : "bg-surface border-outline-variant hover:bg-surface-variant"
                }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`font-semibold text-sm ${p.id === id ? "text-primary" : "text-on-surface truncate pr-2"}`}>
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

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
        <Card className="p-6">
          <h3 className="font-merriweather text-lg font-bold text-on-surface mb-6">Project Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Project Name *">
              <TextInput
                name="name"
                defaultValue={currentProject.name}
                required
              />
            </FormField>

            <FormField label="Project Type">
              <Select
                options={[
                  { label: "General", value: "General" },
                  { label: "Mechanical", value: "Mechanical" },
                  { label: "Electrical", value: "Electrical" },
                  { label: "Software", value: "Software" },
                  { label: "Combined", value: "Combined" },
                ]}
                name="type"
                defaultValue={currentProject.type || "General"}
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
                  className="w-full px-3 py-2 bg-surface text-on-surface border border-outline rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px]"
                  defaultValue={currentProject.description || ""}
                />
              </FormField>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-merriweather text-lg font-bold text-on-surface mb-6">Management & Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* REAL DATA INTEGRATION HERE */}
            <FormField label="Assigned Project Manager">
              <Select
                name="assigned_pm_id"
                options={pmOptions}
                defaultValue={currentProject.assigned_pm_id || ""}
                onChange={() => { }}
              />
            </FormField>

            {/* REAL DATA INTEGRATION HERE */}
            <FormField label="Client Organization">
              <Select
                name="client_org_id"
                options={clientOptions}
                defaultValue={currentProject.client_org_id || ""}
                onChange={() => { }}
              />
            </FormField>

            <FormField label="Created Date">
              <TextInput
                type="date"
                disabled
                defaultValue={new Date(currentProject.created_at).toISOString().split('T')[0]}
                className="opacity-60 cursor-not-allowed"
              />
            </FormField>

            <FormField label="Target Completion">
              <TextInput
                name="target_date"
                type="date"
                defaultValue={formattedTargetDate}
              />
            </FormField>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg font-semibold hover:bg-surface-variant transition-colors"
          >
            <LifeBuoy className="w-4 h-4" />
            Raise Ticket
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}