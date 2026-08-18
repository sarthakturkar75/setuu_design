"use client";
import * as React from "react";
import { FormField } from "@/components/ui/FormField";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { AlertTriangleIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { createIssue } from "@/app/actions/issueActions";

export default function IssueLoggingPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 pb-32">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-semantic-crimson/10 flex items-center justify-center">
          <AlertTriangleIcon className="w-5 h-5 text-semantic-crimson" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-merriweather text-on-surface">Log New Issue</h2>
          <p className="text-on-surface-variant mt-1">Report a defect, snag, or blocker for this project.</p>
        </div>
      </div>

      <form action={async (formData) => {
        setIsSubmitting(true);
        try {
          const data = {
            title: formData.get("title"),
            description: formData.get("description"),
            severity: formData.get("severity"),
            type: formData.get("type"),
          };
          
          const res = await createIssue(id, data);
          if (res.success) {
            alert("Issue logged successfully!");
            router.push(`/pm/projects/${id}/issues`);
          } else {
            alert("Error: " + res.error);
          }
        } finally {
          setIsSubmitting(false);
        }
      }} className="space-y-6 bg-surface-container border border-outline-variant rounded-xl p-6">
        
        <FormField label="Issue Title *">
          <TextInput name="title" placeholder="e.g. Foundation crack detected in Sector B" required />
        </FormField>

        <FormField label="Description">
          <TextArea name="description" placeholder="Provide detailed information about the issue..." rows={4} />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Severity *">
            <Select name="severity" required options={[
              { label: "Low", value: "Low" },
              { label: "Medium", value: "Medium" },
              { label: "High", value: "High" },
              { label: "Critical", value: "Critical" },
            ]} />
          </FormField>
          
          <FormField label="Issue Type *">
            <Select name="type" required options={[
              { label: "Defect", value: "Defect" },
              { label: "Safety Hazard", value: "Safety" },
              { label: "Material Shortage", value: "Material" },
              { label: "Design Query", value: "Design" },
              { label: "Other", value: "Other" },
            ]} />
          </FormField>
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-outline-variant">
          <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Issue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
