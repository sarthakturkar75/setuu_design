"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { getProductivityScore } from "@/app/actions/productivityActions";

export default function VendorDashboard() {
  const [score, setScore] = useState<number>(0);
  
  useEffect(() => {
    // We pass "mock" because the action extracts the session user.id itself
    getProductivityScore("mock").then(setScore);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Supplier Portal" subtitle="Your dispatch and delivery overview." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Compliance Score" value={`${score}%`} icon={null as any} />
      </div>
      <Card className="p-6 text-slate-400">Dashboard feed coming soon.</Card>
    </div>
  );
}
