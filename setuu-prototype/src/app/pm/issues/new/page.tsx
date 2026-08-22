"use client";

import { useToast } from "@/contexts/ToastContext";
import * as React from "react";
import { FormField } from "@/components/ui/FormField";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { AlertTriangleIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createIssue } from "@/app/actions/issueActions";
import { getProjects } from "@/app/actions/projectActions";

export default function GlobalIssueLoggingPage() {
  const toast = useToast();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [projects, setProjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const projectId = formData.get("project_id") as string;
    
    if (!projectId) {
      toast.error("Please select a project.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await createIssue(formData);
      if (res.success) {
        toast.success("Issue logged successfully!");
        router.push(`/pm/projects/${projectId}/issues`);
      } else {
        toast.error("Error: " + res.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 pb-32">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-semantic-crimson/10 flex items-center justify-center">
          <AlertTriangleIcon className="w-5 h-5 text-semantic-crimson" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-merriweather text-on-surface">Log Global Issue</h2>
          <p className="text-on-surface-variant mt-1">Select a project and report a defect, snag, or blocker.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface-container border border-outline-variant rounded-xl p-6">
        
        <FormField label="Project *">
          <Select name="project_id" required options={projects.map(p => ({ label: p.name, value: p.id }))} />
        </FormField>

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
          <Button variant="ghost" type="button" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isSubmitting ? "Submitting..." : "Submit Issue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
