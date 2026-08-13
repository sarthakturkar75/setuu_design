import { createClient } from "@/lib/supabase/server";
import { KPICard } from "@/components/ui/KPICard";
import { ActivityFeed, type ActivityItem } from "@/components/ui/ActivityFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusTone } from "@/components/ui/StatusBadge";
import {
  BriefcaseIcon,
  CircleDollarSignIcon,
  ShieldCheckIcon,
  MapIcon,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Total Active Projects
  const { count: activeProjectsCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .in("status", ["In Progress", "Not Started"]);

  // 2. Financial Variances (Total Contract Value for now)
  const { data: projects } = await supabase.from("projects").select("contract_value");
  const totalValue = projects?.reduce((acc, p) => acc + (Number(p.contract_value) || 0), 0) || 0;
  
  // 3. Vendor Health (Critical Issues)
  const { count: criticalIssuesCount } = await supabase
    .from("project_issues")
    .select("*", { count: "exact", head: true })
    .eq("severity", "Critical");

  // Fetch Activity Stream
  const { data: recentUpdates } = await supabase
    .from("updates")
    .select("id, caption, created_at, approval_status, author:author_id(display_name)")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentAudits } = await supabase
    .from("audit_log")
    .select("id, event_type, table_name, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const activities: ActivityItem[] = [];
  
  if (recentUpdates) {
    recentUpdates.forEach((u: any) => {
      activities.push({
        id: u.id,
        type: "update",
        author_name: u.author?.[0]?.display_name || "Unknown Author",
        content: `Field Report: ${u.caption || "No caption provided."}`,
        timestamp: u.created_at,
      });
    });
  }

  if (recentAudits) {
    recentAudits.forEach((a: any) => {
      activities.push({
        id: a.id,
        type: "issue",
        author_name: "System",
        content: `System performed ${a.event_type} on ${a.table_name}`,
        timestamp: a.created_at,
      });
    });
  }

  // Sort combined activities by timestamp
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const finalActivities = activities.slice(0, 10); // Take top 10

  return (
    <div className="flex flex-col space-y-8 max-w-7xl mx-auto w-full pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Executive Dashboard</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Organizational command center and strategic oversight.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Active Projects"
          value={activeProjectsCount || 0}
          icon={<BriefcaseIcon className="w-5 h-5 text-semantic-sky" />}
          trend={{ value: 12, label: "from last month", isPositive: true }}
        />
        <KPICard
          title="Total Contract Value"
          value={`$${totalValue.toLocaleString()}`}
          icon={<CircleDollarSignIcon className="w-5 h-5 text-semantic-amber" />}
          trend={{ value: 2.4, label: "variance", isPositive: true }}
        />
        <KPICard
          title="Critical Issues"
          value={criticalIssuesCount || 0}
          icon={<ShieldCheckIcon className="w-5 h-5 text-semantic-crimson" />}
          trend={{ value: 5, label: "resolved this week", isPositive: true }}
        />
      </div>

      {/* Main Grid: Map & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[400px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-semantic-sky" />
                Regional Project Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center bg-surface-container-lowest/50 rounded-b-xl border-t border-outline-variant/30">
              <div className="w-full max-w-sm aspect-video bg-surface-container-high rounded-lg flex items-center justify-center overflow-hidden border border-outline-variant/50 relative">
                <span className="font-jetbrains-mono text-sm text-on-surface-variant z-10 bg-surface/80 px-3 py-1 rounded">
                  [ Interactive Map Module Pending Integration ]
                </span>
                {/* Mock grid lines for structural feel */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              </div>
              <p className="mt-4 text-sm font-inter text-on-surface-variant max-w-md text-center">
                Geospatial distribution of all active projects across managed regions. Real-time telemetry will be plotted here.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Stream */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Recent Activity Stream</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              {finalActivities.length > 0 ? (
                <ActivityFeed items={finalActivities} />
              ) : (
                <div className="h-full min-h-[200px] flex items-center justify-center text-sm font-inter text-on-surface-variant">
                  No recent activities recorded.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}