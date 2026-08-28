"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export default function EngineerDocs() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Team Wiki & Docs" subtitle="Standards, SOPs, and project documentation." />
      <Card className="p-6 text-slate-400">Documentation viewer coming soon.</Card>
    </div>
  );
}
