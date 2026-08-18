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

export default function NewChangeRequestPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const params = useParams();
  const id = params?.id as string;

  if (isSubmitted) {
    return (
      <div className="p-6 max-w-200 mx-auto space-y-8 pt-24 text-center">
        <CheckCircleIcon className="w-16 h-16 text-semantic-emerald mx-auto mb-4" />
        <h2 className="text-2xl font-bold font-merriweather text-on-surface">Change Request Submitted</h2>
        <p className="text-on-surface-variant max-w-md mx-auto">Your draft has been routed to the client and engineering teams for review.</p>
        <div className="pt-8">
          <Link href={`/pm/projects/${id}`}>
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

      <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }} className="space-y-6 bg-surface-container border border-outline-variant rounded-xl p-6">

        <FormField label="Request Title">
          <TextInput placeholder="e.g., HVAC routing variation due to beam clash" />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Impact on Timeline">
            <TextInput placeholder="e.g., +2 Days" />
          </FormField>
          <FormField label="Impact on Cost">
            <TextInput placeholder="e.g., $4,500" />
          </FormField>
        </div>

        <FormField label="Detailed Description & Justification">
          <TextArea
            placeholder="Explain the reason for the change, alternatives considered, and the necessary steps to implement it."
            rows={5}
          />
        </FormField>

        <FormField label="Supporting Documents (Drawings, Quotes, Photos)">
          <FileDropzone onFileSelect={() => { }} />
        </FormField>

        <div className="pt-4 flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={() => setIsSubmitted(true)}>Save Draft</Button>
          <Button variant="primary" type="submit">Submit for Client Approval</Button>
        </div>
      </form>
    </div>
  );
}
