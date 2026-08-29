"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { TextArea } from "@/components/ui/TextArea";
import { createUpdate } from "@/app/actions/updateActions";
import { Toast, toast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

export default function EngineerCreateUpdate({ params }: { params: { id: string } }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePost = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await createUpdate(new FormData());
      if (res.success) {
        toast.success("Update posted successfully.");
        router.push(`/engineer/projects/${params.id}`);
      } else {
        toast.error(res.error || "Failed to post update");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <PageHeader title="Post Site Update" subtitle="Share progress, photos, and daily logs." />
      
      <Card className="p-6 space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Attach Photos / Files</h4>
          <FileDropzone onFileSelect={() => {}} accept="image/*,video/*" />
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Update Details</h4>
          <TextArea 
            rows={5} 
            placeholder="Describe what was accomplished today..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handlePost} disabled={loading || !content.trim()}>
            {loading ? "Posting..." : "Post Update"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
