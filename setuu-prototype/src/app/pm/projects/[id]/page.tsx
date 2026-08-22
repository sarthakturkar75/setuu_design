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
  const [milestones, setMilestones] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>({ progress: 0, openIssues: 0, daysToTarget: 0, budgetVariance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [team, activities, proj, issues, changes, milestones_data] = await Promise.all([
          getProjectTeam(id),
          getRecentActivity(id),
          getProjectById(id),
          getIssues(id),
          getChangeRequests(id),
          getProjectMilestones(id)
        ]);
        setTeamMembers(team);
        setRecentActivity(activities);
        setMilestones(milestones_data);

        const openIssuesCount = (issues || []).filter((i: any) => i.status === 'Open').length;
        
        const totalChangesCost = (changes || []).filter((c: any) => c.status === 'Approved').reduce((acc: number, c: any) => acc + Number(c.cost_impact || 0), 0);
        const budgetVar = proj?.contract_value ? (totalChangesCost / proj.contract_value) * 100 : 0;

        let daysToTarget = 0;
        if (proj?.target_date) {
          const diff = new Date(proj.target_date).getTime() - new Date().getTime();
          daysToTarget = Math.ceil(diff / (1000 * 3600 * 24));
        }

        const totalMilestones = milestones_data?.length || 0;
        const completedMilestones = (milestones_data || []).filter((m: any) => m.completion_status === true || m.status_label === 'Completed').length;
        const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

        setKpis({ progress, openIssues: openIssuesCount, daysToTarget, budgetVariance: budgetVar });
      } catch (error) {
        console.error("Failed to load project data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="p-6 animate-pulse text-on-surface-variant">Loading project dashboard...</div>;

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
          value={kpis.daysToTarget > 0 ? kpis.daysToTarget.toString() : kpis.daysToTarget < 0 ? `${Math.abs(kpis.daysToTarget)} overdue` : "Today"} 
          icon={<Clock className="w-5 h-5" />} 
          semanticColor={kpis.daysToTarget < 30 ? "crimson" : "slate"}
        />
        <KPICard 
          title="Budget Variance" 
          value={`${kpis.budgetVariance > 0 ? '+' : ''}${kpis.budgetVariance.toFixed(1)}%`} 
          icon={<DollarSign className="w-5 h-5 text-semantic-crimson" />} 
          semanticColor={kpis.budgetVariance > 5 ? "crimson" : "emerald"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-merriweather text-lg font-bold text-on-surface mb-6">Milestone Progress</h3>
            <div className="space-y-6">
              {(milestones || []).length === 0 ? (
                <p className="text-sm text-on-surface-variant">No milestones created yet.</p>
              ) : (
                (milestones || []).slice(0, 5).map((m: any, i: number) => {
                  const isCompleted = m.completion_status === true || m.status_label === 'Completed';
                  const progress = isCompleted ? 100 : (m.weight_percent || 0);
                  const color = isCompleted ? 'semantic-emerald' : m.status_label === 'Overdue' ? 'semantic-crimson' : 'semantic-sky';
                  return (
                    <div key={m.id || i}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-on-surface">{m.title}</span>
                        <span className={`text-sm font-jetbrains font-bold text-${color}`}>{progress}%</span>
                      </div>
                      <div className={`[&>div]:bg-${color}`}>
                        <ProgressBar progress={progress} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-merriweather text-lg font-bold text-on-surface mb-4">Recent Activity</h3>
            <ActivityFeed items={recentActivity.map((a: any) => ({ id: a.id, type: a.type, content: a.title, author_name: a.user, timestamp: a.time }))} />
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
