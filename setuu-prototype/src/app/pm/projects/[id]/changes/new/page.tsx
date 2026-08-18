"use client";
import * as React from "react";
import { FormField } from "@/components/ui/FormField";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { Button } from "@/components/ui/Button";

export default function NewChangeRequestPage() {
  return (
    <div className="p-6 max-w-[800px] mx-auto space-y-8 pb-32">
      <div>
        <h2 className="text-2xl font-bold font-merriweather text-on-surface">Draft Change Request</h2>
        <p className="text-on-surface-variant mt-1">Submit a formal request for scope, timeline, or cost changes.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); alert("Successfully submitted!"); }} className="space-y-6 bg-surface-container border border-outline-variant rounded-xl p-6">

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
          <Button variant="ghost" type="button">Save Draft</Button>
          <Button variant="primary" type="submit">Submit for Client Approval</Button>
        </div>
      </form>
    </div>
  );
}
