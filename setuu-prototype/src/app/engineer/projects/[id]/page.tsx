"use client";
import React, { useState, useEffect, use } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getProjectById } from "@/app/actions/projectActions";

export default function EngineerProjectDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    getProjectById(id).then((p) => setProject(p));
  }, [id]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title={project?.name || "Project Dashboard"} subtitle="Project overview." />
      <Card className="p-6 text-slate-400">Project details loading...</Card>
    </div>
  );
}
