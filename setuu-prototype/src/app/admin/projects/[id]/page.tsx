"use client";

import { KPICard } from "@/components/ui/KPICard";
import { Card } from "@/components/ui/Card";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CheckCircle, AlertOctagon, Clock, DollarSign, Download, Share2 } from "lucide-react";
import { use, useState, useEffect } from "react";
import { getProjectTeam, getRecentActivity, getProjectById } from "@/app/actions/projectActions";
import { getIssues } from "@/app/actions/issueActions";
import { getChangeRequests } from "@/app/actions/changeRequestActions";
import { getProjectMilestones } from "@/app/actions/milestoneActions";
import { getActionItems } from "@/app/actions/dashboardActions";
import { getPortfolioAverages } from "@/app/actions/portfolioActions";

// New Components
import { AIWelcomeBanner } from "@/components/ui/AIWelcomeBanner";
import { SmartInbox, ActionItem } from "@/components/ui/SmartInbox";
import { RiskScoreGauge } from "@/components/ui/RiskScoreGauge";
import { PublicShareButton } from "@/components/ui/PublicShareButton";
import { PortfolioRadarChart } from "@/components/ui/PortfolioRadarChart";
import { DraggableGrid } from "@/components/ui/DraggableGrid";
import { FinancialHealthWidget, IssueTrackerWidget, TimelineWidget } from "@/components/ui/DashboardWidgets";
import { PrintExportButton } from "@/components/ui/PrintExportButton";

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
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [riskScore, setRiskScore] = useState(0);
  const [aiMessage, setAiMessage] = useState("");

  // NEW: Added state to hold the current project's raw data
  const [projectData, setProjectData] = useState<any>(null);
  const [portfolioData, setPortfolioData] = useState<any>({ avgProgress: 0, avgRiskScore: 0, avgBudgetVariance: 0 });


  useEffect(() => {
    async function loadData() {
      try {
        const [team, activities, proj, issues, changes, milestones_data, portData, realActionItems] = await Promise.all([
          getProjectTeam(id),
          getRecentActivity(id),
          getProjectById(id),
          getIssues(id),
          getChangeRequests(id),
          getProjectMilestones(id),
          getPortfolioAverages(),
          getActionItems(id)
        ]);

        setTeamMembers(team || []);
        setRecentActivity(activities || []);
        setMilestones(milestones_data || []);

        // Populate both project and portfolio data for the radar chart
        setProjectData(proj || {});
        setPortfolioData(portData || { avgProgress: 0, avgRiskScore: 0, avgBudgetVariance: 0 });

        setActionItems(realActionItems || []);

        const issuesList = issues || [];
        const changesList = changes || [];
        const milestonesList = milestones_data || [];

        const openIssuesCount = issuesList.filter((i: any) => i.status === 'Open').length;
        const criticalIssuesCount = issuesList.filter((i: any) => i.status === 'Open' && (i.severity === 'High' || i.severity === 'Critical')).length;

        const totalChangesCost = changesList.filter((c: any) => c.status === 'Approved').reduce((acc: number, c: any) => acc + Number(c.cost_impact || 0), 0);
        const budgetVar = proj?.contract_value ? (totalChangesCost / proj.contract_value) * 100 : 0;

        let daysToTarget = 0;
        if (proj?.target_date) {
          const diff = new Date(proj.target_date).getTime() - new Date().getTime();
          daysToTarget = Math.ceil(diff / (1000 * 3600 * 24));
        }

        const totalMilestones = milestonesList.length;
        const completedMilestones = milestonesList.filter((m: any) => m.completion_status === true || m.status_label === 'Completed').length;
        const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
        const overdueMilestones = milestonesList.filter((m: any) => m.status_label === 'Overdue').length;

        setKpis({ progress, openIssues: openIssuesCount, daysToTarget, budgetVariance: budgetVar });

        let calculatedRisk = 10 + (criticalIssuesCount * 15) + (overdueMilestones * 10) + (budgetVar > 0 ? budgetVar * 5 : 0);
        if (calculatedRisk > 100) calculatedRisk = 100;
        if (calculatedRisk < 0) calculatedRisk = 0;
        setRiskScore(Math.round(calculatedRisk));

        // Let's call the real AI generation server action
        import("@/app/actions/aiActions").then(module => {
          module.generateWelcomeBrief(id, {
            name: proj?.name || 'Project',
            progress,
            criticalIssues: criticalIssuesCount,
            budgetVar,
            actionItemCount: (realActionItems || []).length
          }).then(brief => setAiMessage(brief))
            .catch(() => setAiMessage("Error: AI Features require OPENAI_API_KEY to be configured in .env. No mock placeholders allowed."));
        }).catch(() => {
          setAiMessage("Error: AI Services module unavailable or failed to load. No mock allowed.");
        });

      } catch (error) {
        console.error("Failed to load project data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="p-6 animate-pulse text-on-surface-variant">Loading enterprise dashboard...</div>;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">

      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-stretch">
        <div className="flex-1 w-full xl:w-auto">
          <AIWelcomeBanner content={aiMessage} />
        </div>
        <div className="flex gap-3 w-full xl:w-auto self-center">
          <PrintExportButton />
          <PublicShareButton projectId={id} />
        </div>
      </div>

      {/* KPI & Risk Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-1 h-32 md:h-full">
          <RiskScoreGauge score={riskScore} />
        </div>
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
      </div>

      <DraggableGrid items={['financial', 'issues', 'timeline']}>
        <FinancialHealthWidget key="financial" kpis={kpis} riskScore={riskScore} />
        <IssueTrackerWidget key="issues" issuesCount={kpis.openIssues} url={`/admin/projects/${id}/issues`} />
        <TimelineWidget key="timeline" progress={kpis.progress} targetDays={kpis.daysToTarget} url={`/admin/projects/${id}/timeline`} />
      </DraggableGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <SmartInbox items={actionItems} />

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
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-6">
              {/* FIXED: Passing both projectData and portfolioData */}
              <PortfolioRadarChart projectData={projectData} portfolioData={portfolioData} />
            </div>
            <div className="text-center">
              <button className="text-xs font-semibold text-primary hover:underline">
                View Full Portfolio Analytics →
              </button>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="font-merriweather text-lg font-bold text-on-surface mb-4">Recent Activity</h3>
        <ActivityFeed items={recentActivity.map((a: any) => ({ id: a.id, type: a.type, content: a.title, author_name: a.user, timestamp: a.time }))} />
      </Card>

    </div>
  );
}