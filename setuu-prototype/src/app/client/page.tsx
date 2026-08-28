"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { getProjects } from "@/app/actions/projectActions";

export default function ClientDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  
  useEffect(() => {
    getProjects().then((data) => setProjects(data || []));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Executive Portfolio Dashboard" subtitle="High-level overview of your active deployments." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Active Projects" value={projects.length.toString()} icon={null as any} />
      </div>
      <Card className="p-6 text-slate-400">Executive dashboard coming soon.</Card>
    </div>
  );
}
