"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getEngineerProductivity } from "@/app/actions/productivityActions";
import { getPendingReviews } from "@/app/actions/reviewActions";
import { getAssignedTasks } from "@/app/actions/timelineActions";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { KPICard } from "@/components/ui/KPICard";

export default function EngineerDashboard() {
  const { user, organizationId } = useAuth();
  const [data, setData] = useState<any>({ productivity: null, pendingReviews: 0, tasks: [] });
  
  useEffect(() => {
    async function load() {
      if (!user && !organizationId) return;

      // We pass 'mock-id' or handle undefined in the action
      const [reviews, tasks] = await Promise.all([
        getPendingReviews(),
        getAssignedTasks()
      ]);
      setData({ pendingReviews: reviews, tasks });
    }
    load();
  }, [user, organizationId]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Engineer Workbench" subtitle="Your personal project execution overview." />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Assigned Tasks" value={data.tasks.length.toString()} icon={null as any} />
        <KPICard title="Pending Reviews" value={data.pendingReviews.toString()} icon={null as any} />
        <KPICard title="Open Blockers" value={data.tasks.filter((t: any) => t.status === 'blocked').length.toString()} icon={null as any} />
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <ActivityFeed items={[]} />
      </Card>
    </div>
  );
}
