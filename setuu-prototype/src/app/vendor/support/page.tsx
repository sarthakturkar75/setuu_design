"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export default function VendorSupport() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Vendor Support" subtitle="Get help and raise tickets." />
      <Card className="p-6 text-slate-400">Support center coming soon.</Card>
    </div>
  );
}
