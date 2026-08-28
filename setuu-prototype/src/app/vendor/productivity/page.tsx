"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { 
  getEngineerProductivity, 
  getPMProductivity, 
  getAdminProductivity,
  getProductivityTrends
} from "@/app/actions/productivityActions";
import { Activity, TrendingUp } from "lucide-react";

export default function ProductivityDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      // In a real implementation, we would use the session user ID or org ID
      let res;
      if (false) {
        res = await getEngineerProductivity("mock-user-id");
      } else if (false) {
        res = await getPMProductivity("mock-pm-id");
      } else {
        res = await getAdminProductivity("mock-org-id");
      }
      setData(res);
    }
    load();
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader 
        title="VENDOR Productivity Analytics" 
        subtitle="Role-specific composite scoring and execution velocity metrics."
      />

      {!data ? (
        <div className="animate-pulse flex space-x-4 p-4">Loading metrics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-primary/5 border-primary/20 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-on-surface-variant mb-2">Composite Score</h3>
            <div className="text-6xl font-bold text-primary">{data.score}</div>
            <p className="text-sm text-on-surface-variant mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-semantic-emerald" /> Top 10% this month
            </p>
          </Card>
          
          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Metric Breakdown</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(data.metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-surface-variant/30 rounded-lg">
                  <span className="text-sm font-medium capitalize text-on-surface-variant">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-bold text-on-surface">{value as number}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
