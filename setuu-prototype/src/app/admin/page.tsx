"use client";

import { KPICard } from "@/components/ui/KPICard";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DonutChart } from "@/components/ui/DonutChart";
import { BarChart } from "@/components/ui/BarChart";
import { 
  Plus, 
  FileText,
  DollarSign,
  FolderKanban,
  TrendingUp,
  AlertTriangle,
  FolderGit2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";

const portfolioHealthData = [
  { name: "In Progress", value: 24, color: "var(--semantic-primary)" },
  { name: "Planning", value: 12, color: "var(--semantic-emerald)" },
  { name: "On Hold", value: 6, color: "var(--semantic-amber)" },
];

const regionalData = [
  { label: "North America", value: 120 },
  { label: "Europe", value: 85 },
  { label: "Asia Pacific", value: 150 },
  { label: "Middle East", value: 40 },
];

const recentActivity = [
  { id: "1", type: "update", title: "Site Inspection Completed", user: "Alice Chen", time: "10 mins ago", project: "Alpha Tower" },
  { id: "2", type: "issue", title: "Material Delivery Delayed", user: "Bob Smith", time: "1 hour ago", project: "Beta Site" },
  { id: "3", type: "approval", title: "Design Phase 2 Approved", user: "Charlie Davis", time: "3 hours ago", project: "Gamma Facility" },
  { id: "4", type: "system", title: "New Vendor Onboarded", user: "System Admin", time: "5 hours ago", project: "Global" },
];

const pendingChangeRequests = [
  { id: "CR-1042", project: "Alpha Tower", impact: "$45,000", time: "+14 Days", status: "pending" },
  { id: "CR-1045", project: "Beta Site", impact: "$12,500", time: "+0 Days", status: "pending" },
  { id: "CR-1048", project: "Gamma Facility", impact: "$89,000", time: "+30 Days", status: "pending" },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader 
        title="Executive Dashboard" 
        subtitle="Portfolio overview and critical metrics"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <span>Admin</span>
            <span>/</span>
            <span>Dashboard</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <FileText className="w-4 h-4" />
              Generate System Report
            </button>
            <Link href="/admin/projects/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          </div>
        }
      />

      <main className="p-6 max-w-[1600px] mx-auto space-y-8">
        {/* Section 1: KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="Total Contract Value" 
            value="₹14.2B" 
            trend={{ value: 12.5, label: "vs last year", isPositive: true }} 
            icon={<DollarSign className="w-5 h-5" />} 
          />
          <KPICard 
            title="CapEx Run Rate" 
            value="₹45M" 
            trend={{ value: 2.1, label: "vs last month", isPositive: true }} 
            icon={<TrendingUp className="w-5 h-5" />} 
          />
          <KPICard 
            title="Active Projects" 
            value="42" 
            trend={{ value: 12, label: "vs last month", isPositive: true }} 
            icon={<FolderGit2 className="w-5 h-5" />} 
            semanticColor="sky"
          />
          <KPICard 
            title="Open Issues" 
            value="84" 
            trend={{ value: 8, label: "vs last week", isPositive: false }} 
            icon={<AlertCircle className="w-5 h-5" />} 
            semanticColor="amber"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section 2: Portfolio Health */}
          <Card className="p-6 flex flex-col">
            <h3 className="text-lg font-merriweather font-bold text-on-surface mb-6">Portfolio Health</h3>
            <div className="flex-1 flex items-center justify-center min-h-[250px]">
              <DonutChart data={portfolioHealthData} title="Portfolio Health" totalLabel="Projects" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {portfolioHealthData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-on-surface-variant flex-1">{item.name}</span>
                  <span className="text-sm font-bold text-on-surface font-jetbrains">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Section 3 & 4: Storage & Regional */}
          <div className="flex flex-col gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-merriweather font-bold text-on-surface mb-4">Storage Quota Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-on-surface-variant">Global Usage</p>
                    <p className="text-2xl font-jetbrains font-bold text-on-surface">8.4 TB <span className="text-sm font-inter text-on-surface-variant font-normal">/ 10 TB</span></p>
                  </div>
                  <span className="text-sm font-bold text-semantic-amber">84%</span>
                </div>
                <div className="[&>div]:bg-semantic-amber">
                  <ProgressBar progress={84} />
                </div>
              </div>
            </Card>

            <Card className="p-6 flex-1">
              <h3 className="text-lg font-merriweather font-bold text-on-surface mb-6">Regional Distribution</h3>
              <div className="h-48">
                <BarChart 
                    data={regionalData} 
                    keys={["value"]}
                    colors={["var(--primary)"]}
                  />
              </div>
            </Card>
          </div>

          {/* Section 6: Change Requests Summary */}
          <Card className="p-6 flex flex-col">
            <div className="mb-4">
            <SectionHeader title="System Status" count={4} />
          </div>
            <div className="space-y-4 flex-1">
              {pendingChangeRequests.map(cr => (
                <div key={cr.id} className="p-4 rounded-lg border border-outline-variant/30 bg-surface-variant/30 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold font-jetbrains text-primary">{cr.id}</span>
                      <h4 className="text-sm font-semibold text-on-surface mt-1">{cr.project}</h4>
                    </div>
                      <StatusBadge tone={cr.status as any} label={cr.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-on-surface-variant">Cost Impact</p>
                      <p className="font-jetbrains font-bold text-semantic-crimson">{cr.impact}</p>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant">Time Impact</p>
                      <p className="font-jetbrains font-bold text-semantic-amber">{cr.time}</p>
                    </div>
                  </div>
                  <button className="text-sm text-primary font-semibold text-left hover:underline mt-1">Review Request →</button>
                </div>
              ))}
            </div>
            <Link href="/admin/changes" className="mt-4 text-sm font-semibold text-primary text-center hover:underline block">
              View All Approvals
            </Link>
          </Card>
        </div>

        {/* Section 5: Activity Stream */}
        <section>
          <div className="mb-4">
            <SectionHeader 
              title="Global Activity Stream" 
              action={
                <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                  View All
                </button>
              } 
            />
          </div>
          <Card className="p-6">
            <ActivityFeed items={recentActivity as any} />
          </Card>
        </section>
      </main>
    </div>
  );
}
