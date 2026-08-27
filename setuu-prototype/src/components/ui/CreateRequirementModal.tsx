"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal"; // Assuming you have a standard Modal component
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { createRequirement } from "@/app/actions/requirementActions";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    onSuccess: () => void;
}

export function CreateRequirementModal({ isOpen, onClose, projectId, onSuccess }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        formData.append("project_id", projectId);

        try {
            const result = await createRequirement(formData);
            if (result.success) {
                toast.success("Requirement created successfully.");
                onSuccess();
                onClose();
            } else {
                toast.error(result.error || "Failed to create requirement.");
            }
        } catch (err: any) {
            toast.error("A critical error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New SRS Requirement">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Requirement Title *</label>
                    <input required name="title" type="text" className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface" placeholder="e.g., Conveyor Motor Torque" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Category</label>
                        <select name="category" className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface">
                            <option value="">Select...</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Software">Software</option>
                            <option value="Quality">Quality Assurance</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Priority *</label>
                        <select required name="priority" defaultValue="Medium" className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Engineering Specification</label>
                    <input name="specification_value" type="text" className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface" placeholder="e.g., 400 Nm @ 1500 RPM" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Customer Original Request (Source)</label>
                    <textarea name="customer_requirement" rows={2} className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface" placeholder="Paste the exact client text here..." />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Create Requirement"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}