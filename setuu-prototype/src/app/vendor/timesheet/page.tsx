"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export default function VendorTimesheet() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Timesheets" subtitle="Log hours for T&M contracts." />
      <Card className="p-6 text-slate-400">Timesheets coming soon.</Card>
    </div>
  );
}
