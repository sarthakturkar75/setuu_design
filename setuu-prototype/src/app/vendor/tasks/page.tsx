"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export default function VendorTasks() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Subcontracted Tasks" subtitle="Tasks assigned to your organization." />
      <Card className="p-6 text-slate-400">Tasks board coming soon.</Card>
    </div>
  );
}
