"use client";

import * as React from "react";
import { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { Button } from "@/components/ui/Button";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createChangeRequest } from "@/app/actions/changeRequestActions";

export default function NewChangeRequestPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [timeImpact, setTimeImpact] = useState("");
  const [costImpact, setCostImpact] = useState("");
  const [description, setDescription] = useState("");

  const params = useParams();
  const projectId = params?.id as string;

  const handleSubmit = async (e: React.FormEvent, status: string = 'Pending') => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    // Construct the FormData exactly as the Server Action expects it
    const formData = new FormData();
    formData.append("project_id", projectId);
    formData.append("title", title);
    formData.append("description", description);

    // Strip non-numeric characters just in case the user typed "$" or "days"
    const parsedCost = costImpact.replace(/[^0-9.-]+/g, "") || "0";
    const parsedTime = timeImpact.replace(/[^0-9.-]+/g, "") || "0";

    formData.append("cost_impact", parsedCost);
    formData.append("time_impact_days", parsedTime);

    // Note: Your current Server Action hardcodes the status to "Pending". 
    // We are passing it here in case you update your action to accept "Draft" later.
    formData.append("status", status);

    try {
      const result = await createChangeRequest(formData);

      if (!result?.success) {
        throw new Error(result?.error || "Unknown error occurred");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Error creating change request:", err);
      alert(`Failed to create change request: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-6 max-w-200 mx-auto space-y-8 pt-24 text-center">
        <CheckCircleIcon className="w-16 h-16 text-semantic-emerald mx-auto mb-4" />
        <h2 className="text-2xl font-bold font-merriweather text-on-surface">Change Request Submitted</h2>
        <p className="text-on-surface-variant max-w-md mx-auto">Your draft has been routed to the client and engineering teams for review.</p>
        <div className="pt-8">
          <Link href={`/pm/projects/${projectId}`}>
            <Button variant="primary">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-200 mx-auto space-y-8 pb-32">
      <div>
        <h2 className="text-2xl font-bold font-merriweather text-on-surface">Draft Change Request</h2>
        <p className="text-on-surface-variant mt-1">Submit a formal request for scope, timeline, or cost changes.</p>
      </div>

      <form onSubmit={(e) => handleSubmit(e, 'Pending')} className="space-y-6 bg-surface-container border border-outline-variant rounded-xl p-6">

        <FormField label="Request Title">
          <TextInput
            placeholder="e.g., HVAC routing variation due to beam clash"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Impact on Timeline (Days)">
            <TextInput
              placeholder="e.g., 2"
              type="number"
              value={timeImpact}
              onChange={(e) => setTimeImpact(e.target.value)}
            />
          </FormField>
          <FormField label="Impact on Cost ($)">
            <TextInput
              placeholder="e.g., 4500"
              type="number"
              value={costImpact}
              onChange={(e) => setCostImpact(e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Detailed Description & Justification">
          <TextArea
            placeholder="Explain the reason for the change, alternatives considered, and the necessary steps to implement it."
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormField>

        <FormField label="Supporting Documents (Drawings, Quotes, Photos)">
          <FileDropzone onFileSelect={() => { }} />
        </FormField>

        <div className="pt-4 flex justify-end gap-3">
          <Button
            variant="ghost"
            type="button"
            onClick={(e) => handleSubmit(e, 'Draft')}
            disabled={isSubmitting}
          >
            Save Draft
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting || !title.trim()}>
            {isSubmitting ? 'Submitting...' : 'Submit for Client Approval'}
          </Button>
        </div>
      </form>
    </div>
  );
}