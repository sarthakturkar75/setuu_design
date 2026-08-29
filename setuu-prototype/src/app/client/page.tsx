"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { getClientPortfolio, getClientFinancialSummary, getClientProjectUpdates } from "@/app/actions/clientActions";
import { getProjectMilestones } from "@/app/actions/milestoneActions";
import { FolderTreeIcon, CreditCard, Activity, Calendar, AlertCircle } from "lucide-react";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { Button } from "@/components/ui/Button";

export default function ClientDashboard() {
  const { user, organizationId } = useAuth();
  const [data, setData] = useState<any>({ portfolio: [], financials: null, updates: [], milestones: [] });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function load() {
      if (!user && !organizationId) return;
      setLoading(true);
      try {
        const portfolio = await getClientPortfolio(organizationId || "");
        const [financials, updates] = await Promise.all([
          getClientFinancialSummary(organizationId || ""),
          getClientProjectUpdates(organizationId || "")
        ]);
        
        let allMilestones: any[] = [];
        if (portfolio && portfolio.length > 0) {
          const milestonesArrs = await Promise.all(
            portfolio.map((p: any) => getProjectMilestones(p.id))
          );
          allMilestones = milestonesArrs.flat().filter(m => m.status !== 'Completed').sort((a, b) => new Date(a.target_date).getTime() - new Date(b.target_date).getTime()).slice(0, 3);
        }

        setData({ portfolio, financials, updates: updates || [], milestones: allMilestones });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, organizationId]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Executive Summary" subtitle="Curated portfolio overview across all your projects." />
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-surface-container rounded-lg"></div>
            <div className="h-24 bg-surface-container rounded-lg"></div>
            <div className="h-24 bg-surface-container rounded-lg"></div>
          </div>
          <div className="h-64 bg-surface-container rounded-lg"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard 
              title="Active Projects" 
              value={data.portfolio.length.toString()} 
              icon={<FolderTreeIcon className="w-5 h-5 text-emerald-500" />} 
            />
            <KPICard 
              title="Total Contract Value" 
              value={`$${(data.financials?.totalContractValue || 0).toLocaleString()}`} 
              icon={<CreditCard className="w-5 h-5 text-blue-500" />} 
            />
            <KPICard 
              title="Total Change Orders" 
              value={`$${(data.financials?.totalChanges || 0).toLocaleString()}`} 
              icon={<Activity className="w-5 h-5 text-orange-500" />} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-on-surface">Project Briefing Feed</h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <div className="p-6 pt-2 h-[400px] overflow-y-auto">
                  {data.updates.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-on-surface-variant">
                      <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                      <p>No recent project updates.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-4">
                      {data.updates.map((update: any) => (
                        <div key={update.id} className="border-l-2 border-primary pl-4 py-1">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-on-surface">{update.projects?.name}</span>
                            <span className="text-xs text-on-surface-variant">{new Date(update.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-on-surface-variant mb-2">{update.content}</p>
                          <div className="flex gap-2">
                            <span className="inline-flex items-center text-xs px-2 py-1 bg-surface-variant rounded-md text-on-surface-variant">
                              Schedule: {update.schedule_status || "On Track"}
                            </span>
                            <span className="inline-flex items-center text-xs px-2 py-1 bg-surface-variant rounded-md text-on-surface-variant">
                              Budget: {update.budget_status || "On Track"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 text-on-surface">Upcoming Milestones</h3>
                <div className="space-y-4">
                  {data.milestones.length === 0 ? (
                    <div className="text-on-surface-variant text-sm">No upcoming milestones across projects.</div>
                  ) : (
                    data.milestones.map((milestone: any) => {
                      const mDate = new Date(milestone.target_date);
                      const month = mDate.toLocaleString('default', { month: 'short' });
                      const day = mDate.getDate();
                      // Find project name
                      const projectName = data.portfolio.find((p: any) => p.id === milestone.project_id)?.name || "Unknown Project";
                      return (
                        <div key={milestone.id} className="flex gap-3">
                          <div className="bg-primary/10 text-primary p-2 rounded-lg flex flex-col items-center justify-center min-w-[3rem]">
                            <span className="text-xs font-bold uppercase">{month}</span>
                            <span className="text-lg font-bold">{day}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-on-surface">{milestone.name}</h4>
                            <p className="text-xs text-on-surface-variant mt-1">{projectName}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4">View Schedule</Button>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                <h3 className="text-lg font-bold mb-2 text-on-surface">Needs Attention</h3>
                <p className="text-sm text-on-surface-variant mb-4">Check approvals and recent sign-offs.</p>
                <Button className="w-full">Review Approvals</Button>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
