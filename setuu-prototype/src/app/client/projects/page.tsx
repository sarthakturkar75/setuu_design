"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getProjects } from "@/app/actions/projectActions";

export default function ClientProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  
  useEffect(() => {
    getProjects().then((data) => setProjects(data || []));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Project Portfolio" subtitle="View all your active and past projects." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(p => (
          <Card key={p.id} className="p-4">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-slate-400">{p.status}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
