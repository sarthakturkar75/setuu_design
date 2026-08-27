"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { createTask } from "@/app/actions/timelineActions";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    onSuccess: () => void;
}

export function CreateTaskModal({ isOpen, onClose, projectId, onSuccess }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const taskData = {
            display_id: formData.get("display_id") as string,
            title: formData.get("title") as string,
            description: formData.get("description") as string || null,
            department: formData.get("department") as string,
            planned_start_date: formData.get("planned_start_date") as string || null,
            due_date: formData.get("due_date") as string || null,
            duration_days: parseInt(formData.get("duration_days") as string) || null,
            priority: formData.get("priority") as string,
        };

        try {
            const result = await createTask(projectId, taskData);
            if (result.success) {
                toast.success("Task added to schedule.");
                onSuccess();
                onClose();
            } else {
                toast.error(result.error || "Failed to create task.");
            }
        } catch (err: any) {
            toast.error("A critical error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Schedule Task">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-on-surface mb-1">Task ID</label>
                        <input name="display_id" type="text" className="w-full p-2 border border-outline-variant rounded bg-surface" placeholder="e.g., T-100" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-on-surface mb-1">Activity Title *</label>
                        <input required name="title" type="text" className="w-full p-2 border border-outline-variant rounded bg-surface" placeholder="e.g., Pour Foundation" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Department</label>
                        <select name="department" className="w-full p-2 border border-outline-variant rounded bg-surface">
                            <option value="General">General</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Software">Software</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Priority</label>
                        <select name="priority" defaultValue="medium" className="w-full p-2 border border-outline-variant rounded bg-surface">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
                    <textarea name="description" rows={2} className="w-full p-2 border border-outline-variant rounded bg-surface" placeholder="Task details..." />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Planned Start</label>
                        <input name="planned_start_date" type="date" className="w-full p-2 border border-outline-variant rounded bg-surface" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Duration (Days)</label>
                        <input name="duration_days" type="number" min="1" className="w-full p-2 border border-outline-variant rounded bg-surface" placeholder="e.g., 5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Due Date</label>
                        <input name="due_date" type="date" className="w-full p-2 border border-outline-variant rounded bg-surface" />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Add Task"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}