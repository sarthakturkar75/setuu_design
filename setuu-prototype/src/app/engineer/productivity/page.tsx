"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { getEngineerProductivity, getProductivityTrends } from "@/app/actions/productivityActions";
import { KPICard } from "@/components/ui/KPICard";
import { Card } from "@/components/ui/Card";
import { BarChart } from "@/components/ui/BarChart";
import { Activity, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Select } from "@/components/ui/Select";

export default function EngineerProductivity() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      try {
        const [prod, trendData] = await Promise.all([
          getEngineerProductivity(user.id),
          getProductivityTrends(user.id, period)
        ]);
        setData(prod);
        
        // Transform trend data for BarChart
        const chartData = {
          labels: trendData.map(d => d.date),
          datasets: [
            {
              label: "Productivity Score",
              data: trendData.map(d => d.score),
              backgroundColor: "rgba(52, 211, 153, 0.6)",
              borderColor: "rgb(16, 185, 129)",
            }
          ]
        };
        setTrends(chartData as any);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, period]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader title="My Productivity Matrix" subtitle="Personal analytics and performance score" />
        <Select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value as any)}
          options={[
            { label: "Last 4 Weeks", value: "week" },
            { label: "Last 4 Months", value: "month" },
            { label: "Last 4 Quarters", value: "quarter" },
          ]}
        />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-surface-container rounded-lg"></div>
          <div className="h-64 bg-surface-container rounded-lg"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard 
              title="Composite Score" 
              value={data?.score || 0} 
              icon={<TrendingUp className="w-5 h-5 text-primary" />} 
              trend={"+5% from last period"}
              trendUp={true}
            />
            <KPICard 
              title="Task Completion Rate" 
              value={`${data?.metrics?.completionRate || 0}%`} 
              icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} 
            />
            <KPICard 
              title="On-Time Delivery" 
              value={`${data?.metrics?.onTimeRate || 0}%`} 
              icon={<Clock className="w-5 h-5 text-blue-500" />} 
            />
            <KPICard 
              title="Utilization Rate" 
              value={`${data?.metrics?.utilizationRate || 0}%`} 
              icon={<Activity className="w-5 h-5 text-amber-500" />} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 col-span-1 lg:col-span-2">
              <h3 className="text-lg font-bold mb-4 text-on-surface">Trend over time</h3>
              {trends && (trends as any).datasets ? (
                <div className="h-72">
                  <BarChart data={trends as any} />
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center text-on-surface-variant">No data available</div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 text-on-surface">Detailed Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">Issue Resolution Speed</span>
                    <span className="font-medium">{data?.metrics?.issueResolutionSpeed || 0} / 100</span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${data?.metrics?.issueResolutionSpeed || 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">Rework Avoidance</span>
                    <span className="font-medium">{data?.metrics?.reworkRateInverse || 0} / 100</span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${data?.metrics?.reworkRateInverse || 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">Blocker Clearance</span>
                    <span className="font-medium">{data?.metrics?.blockerClearance || 0} / 100</span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${data?.metrics?.blockerClearance || 0}%` }}></div>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-outline-variant/30 text-sm">
                  <p className="text-on-surface-variant mb-2">Team Comparison (Anonymous)</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-on-surface">{data?.score || 0}</span>
                    <span className="text-on-surface-variant">You</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50 mt-1">
                    <span className="text-lg font-bold text-on-surface">78</span>
                    <span className="text-on-surface-variant">Team Avg</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
