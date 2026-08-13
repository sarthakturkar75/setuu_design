"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { updateProjectConfig } from "@/app/actions/projectActions";
import { SaveIcon } from "lucide-react";

export function ProjectConfigForm({ project }: { project: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    formData.append("id", project.id);
    
    try {
      const res = await updateProjectConfig(formData);
      if (res.error) {
        setMessage({ text: res.error, type: "error" });
      } else {
        setMessage({ text: "Configuration saved successfully.", type: "success" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>General Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <div
              className={`p-3 text-sm rounded-md border ${
                message.type === "error"
                  ? "bg-semantic-crimson-bg text-semantic-crimson-on border-semantic-crimson-bg/50"
                  : "bg-semantic-emerald-bg text-semantic-emerald-on border-semantic-emerald-bg/50"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-on-surface">Project Name</label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={project.name || ""}
                required
                className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-on-surface">Status</label>
              <select
                id="status"
                name="status"
                defaultValue={project.status || "Not Started"}
                className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Delivered">Delivered</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="text-sm font-medium text-on-surface">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={project.description || ""}
                className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="po_reference" className="text-sm font-medium text-on-surface">PO Reference</label>
              <input
                id="po_reference"
                name="po_reference"
                type="text"
                defaultValue={project.po_reference || ""}
                className="w-full font-jetbrains-mono rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contract_value" className="text-sm font-medium text-on-surface">Contract Value ($)</label>
              <input
                id="contract_value"
                name="contract_value"
                type="number"
                step="0.01"
                defaultValue={project.contract_value || ""}
                className="w-full font-jetbrains-mono rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="target_date" className="text-sm font-medium text-on-surface">Target Date</label>
              <input
                id="target_date"
                name="target_date"
                type="date"
                defaultValue={project.target_date ? new Date(project.target_date).toISOString().split('T')[0] : ""}
                className="w-full font-jetbrains-mono rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-outline-variant pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-md font-medium text-sm transition-colors hover:bg-primary/90 focus-visible:outline-none disabled:opacity-50"
          >
            <SaveIcon className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </CardFooter>
      </Card>
    </form>
  );
}
