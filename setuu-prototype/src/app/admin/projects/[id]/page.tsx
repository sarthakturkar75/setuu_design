"use client";

import { KPICard } from "@/components/ui/KPICard";
import { Card } from "@/components/ui/Card";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CheckCircle, AlertOctagon, Clock, DollarSign } from "lucide-react";
import { use, useState, useEffect } from "react";
import { getProjectTeam, getRecentActivity, getProjectById } from "@/app/actions/projectActions";
import { getIssues } from "@/app/actions/issueActions";
import { getChangeRequests } from "@/app/actions/changeRequestActions";
import { getProjectMilestones } from "@/app/actions/milestoneActions";

export default function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>({ progress: 0, openIssues: 0, daysToTarget: 0, budgetVariance: 0 });

  useEffect(() => {
    async function loadData() {
      const [team, activities, proj, issues, changes, milestones] = await Promise.all([
        getProjectTeam(id),
        getRecentActivity(id),
        getProjectById(id),
        getIssues(id),
        getChangeRequests(id),
        getProjectMilestones(id)
      ]);
      setTeamMembers(team);
      setRecentActivity(activities);

      const openIssuesCount = (issues || []).filter((i: any) => i.status === 'Open').length;
      
      const totalChangesCost = (changes || []).filter((c: any) => c.status === 'Approved').reduce((acc: number, c: any) => acc + Number(c.cost_impact || 0), 0);
      const budgetVar = proj?.contract_value ? (totalChangesCost / proj.contract_value) * 100 : 0;

      let daysToTarget = 0;
      if (proj?.target_date) {
        const diff = new Date(proj.target_date).getTime() - new Date().getTime();
        daysToTarget = Math.ceil(diff / (1000 * 3600 * 24));
      }

      const totalMilestones = milestones?.length || 0;
      const completedMilestones = (milestones || []).filter((m: any) => m.status === 'Completed').length;
      const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

      setKpis({ progress, openIssues: openIssuesCount, daysToTarget, budgetVariance: budgetVar });
    }
    loadData();
  }, [id]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard 
          title="Overall Progress" 
          value={`${kpis.progress}%`} 
          icon={<CheckCircle className="w-5 h-5" />} 
          semanticColor="emerald"
        />
        <KPICard 
          title="Open Issues" 
          value={kpis.openIssues.toString()} 
          icon={<AlertOctagon className="w-5 h-5" />} 
          semanticColor={kpis.openIssues > 0 ? "amber" : "emerald"}
        />
        <KPICard 
          title="Days to Target" 
          value={kpis.daysToTarget > 0 ? kpis.daysToTarget.toString() : "0"} 
          icon={<Clock className="w-5 h-5" />} 
          semanticColor={kpis.daysToTarget < 30 ? "crimson" : "slate"}
        />
        <KPICard 
          title="Budget Variance" 
          value={`+${kpis.budgetVariance.toFixed(1)}%`} 
          icon={<DollarSign className="w-5 h-5 text-semantic-crimson" />} 
          semanticColor={kpis.budgetVariance > 5 ? "crimson" : "emerald"}
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
