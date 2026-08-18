"use client";

import { KPICard } from "@/components/ui/KPICard";
import { Card } from "@/components/ui/Card";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CheckCircle, AlertOctagon, Clock, DollarSign } from "lucide-react";
import { use, useState, useEffect } from "react";
import { getProjectTeam, getRecentActivity } from "@/app/actions/projectActions";

export default function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const [team, activities] = await Promise.all([
        getProjectTeam(id),
        getRecentActivity(id)
      ]);
      setTeamMembers(team);
      setRecentActivity(activities);
    }
    loadData();
  }, [id]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard 
          title="Overall Progress" 
          value="45%" 
          icon={<CheckCircle className="w-5 h-5" />} 
          semanticColor="emerald"
        />
        <KPICard 
          title="Open Issues" 
          value="12" 
          trend={{ value: 2, label: "vs last week", isPositive: false }} 
          icon={<AlertOctagon className="w-5 h-5" />} 
          semanticColor="amber"
        />
        <KPICard 
          title="Days to Target" 
          value="340" 
          icon={<Clock className="w-5 h-5" />} 
        />
        <KPICard 
          title="Budget Variance" 
          value="+4.2%" 
          trend={{ value: 1.1, label: "vs baseline", isPositive: false }} 
          icon={<DollarSign className="w-5 h-5 text-semantic-crimson" />} 
          semanticColor="crimson"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-merriweather text-lg font-bold text-on-surface mb-6">Milestone Progress</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-on-surface">Phase 1: Foundation & Structure</span>
                  <span className="text-sm font-jetbrains font-bold text-semantic-emerald">100%</span>
                </div>
                <div className="[&>div]:bg-semantic-emerald">
                  <ProgressBar progress={100} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-on-surface">Phase 2: MEP Rough-ins</span>
                  <span className="text-sm font-jetbrains font-bold text-semantic-sky">45%</span>
                </div>
                <div className="[&>div]:bg-semantic-sky">
                  <ProgressBar progress={45} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-on-surface">Phase 3: Finishes</span>
                  <span className="text-sm font-jetbrains font-bold text-outline-variant">0%</span>
                </div>
                <ProgressBar progress={0} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-merriweather text-lg font-bold text-on-surface mb-4">Recent Activity</h3>
            <ActivityFeed items={recentActivity as any} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-merriweather text-lg font-bold text-on-surface mb-4">Team Directory</h3>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Active Members</span>
              <AvatarGroup 
                users={teamMembers.map((m, i) => ({ id: String(i), name: m.name, avatarUrl: null }))} 
                max={4} 
              />
            </div>
            <div className="space-y-4">
              {teamMembers.map((member, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {member.fallback}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-on-surface">{member.name}</p>
                    <p className="text-xs text-on-surface-variant">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
