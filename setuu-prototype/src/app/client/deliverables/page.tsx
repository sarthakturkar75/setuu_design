"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export default function ClientDeliverables() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Deliverables" subtitle="Presentation room for final documents." />
      <Card className="p-6 text-slate-400">Deliverables room coming soon.</Card>
    </div>
  );
}
