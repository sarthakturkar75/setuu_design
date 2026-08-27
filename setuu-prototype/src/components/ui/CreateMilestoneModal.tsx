"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { createMilestone } from "@/app/actions/milestoneActions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  defaultDepartment?: string;
  onSuccess: () => void;
}

export function CreateMilestoneModal({ isOpen, onClose, projectId, defaultDepartment, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const departmentStr = formData.get("department") as string;

    // Safety Fallback: Default Start Date to Today if left blank
    const defaultStart = new Date().toISOString().split('T')[0];

    const milestoneData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      wbs_code: (formData.get("wbs_code") as string) || null,
      sov_value: parseFloat(formData.get("sov_value") as string) || 0,
      department: departmentStr === "General" || !departmentStr ? null : departmentStr,
      baseline_start_date: (formData.get("baseline_start_date") as string) || defaultStart,
      target_date: (formData.get("target_date") as string) || null,
      weight_percent: parseFloat(formData.get("weight_percent") as string) || 0,
      is_exterior: formData.get("is_exterior") === "on",
      completion_status: false,
      custom_data: { kanban_status: 'todo' }
    };

    try {
      const result = await createMilestone(projectId, milestoneData);
      if (result.success) {
        toast.success("Milestone phase created successfully.");
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Failed to create milestone.");
      }
    } catch (err: any) {
      toast.error("A critical error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Define Project Phase (Milestone)">
      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-on-surface mb-1">Phase Title <span className="text-semantic-crimson">*</span></label>
            <input required name="title" type="text" className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface" placeholder="e.g., Factory Acceptance Test" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-on-surface mb-1">WBS Code</label>
            <input name="wbs_code" type="text" className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface font-mono" placeholder="e.g., 2.1.4" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
          <textarea name="description" rows={2} className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface" placeholder="High-level description of this phase..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Lead Department</label>
            <select name="department" defaultValue={defaultDepartment || "General"} className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface">
              <option value="General">General</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Software">Software</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">SOV Value (Financials) $</label>
            <input name="sov_value" type="number" step="0.01" min="0" className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface" placeholder="e.g., 15000" />
          </div>
        </div>

        <div className="p-3 rounded-lg border border-outline-variant/50 bg-surface-variant/20 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Schedule Constraints</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-on-surface mb-1">Baseline Start Date</label>
              <input name="baseline_start_date" type="date" className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-on-surface mb-1">Target Completion Date</label>
              <input required name="target_date" type="date" className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="is_exterior" name="is_exterior" className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary" />
            <label htmlFor="is_exterior" className="text-sm text-on-surface">Flag as Exterior/Weather-Dependent</label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create Phase"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}