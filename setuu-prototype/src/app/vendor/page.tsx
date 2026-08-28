"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { getVendorProductivity } from "@/app/actions/productivityActions";
import { PackageIcon, AlertTriangleIcon, TrendingUp } from "lucide-react";

export default function VendorDashboard() {
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    async function load() {
      const res = await getVendorProductivity("mock-id");
      setData(res);
    }
    load();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Supplier Portal" subtitle="Your dispatch and delivery overview." />
      
      {!data ? (
        <div className="animate-pulse p-4">Loading stats...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard title="Compliance Score" value={`${data.score}%`} icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} />
            <KPICard title="On-Time Delivery" value={`${data.metrics.onTimeDelivery}%`} icon={<PackageIcon className="w-5 h-5" />} />
            <KPICard title="Defect Rate (Inverse)" value={`${data.metrics.defectRateInverse}%`} icon={<AlertTriangleIcon className="w-5 h-5 text-orange-500" />} />
          </div>
          <Card className="p-6 text-on-surface-variant">
            <h3 className="text-lg font-semibold mb-4">Recent Deliveries Feed</h3>
            <p className="text-sm">No new delivery updates.</p>
          </Card>
        </>
      )}
    </div>
  );
}
