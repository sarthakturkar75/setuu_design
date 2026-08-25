"use client";
import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { createResource } from "@/app/actions/resourceActions";
import { useToast } from "@/contexts/ToastContext";

export function CreateResourceModal({
  projectId,
  onClose,
  onRefresh,
}: {
  projectId: string;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.append("project_id", projectId);

    // Convert generic form fields to expected format
    fd.set("resource_type", fd.get("type") as string);
    fd.set("allocated_hours", fd.get("hours") as string);

    const res = await createResource(fd);

    if (res.success) {
      toast.success("Resource added successfully");
      onRefresh();
      onClose();
    } else {
      toast.error(res.error || "Failed to add resource");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/30">
        <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface">
          <h2 className="text-lg font-bold text-on-surface">
            Add General Resource
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-variant rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1">
              Resource Name
            </label>
            <input
              name="name"
              required
              placeholder="e.g. Concrete Mixer / General Laborer"
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1">
              Type
            </label>
            <select
              name="type"
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:border-primary outline-none"
            >
              <option value="labor">Labor</option>
              <option value="equipment">Equipment</option>
              <option value="material">Material</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1">
              Allocated Hours (Optional)
            </label>
            <input
              name="hours"
              type="number"
              min="0"
              defaultValue="0"
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:border-primary outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface text-on-surface rounded-lg font-semibold hover:bg-surface-variant text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 text-sm"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4" /> Add Resource
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
