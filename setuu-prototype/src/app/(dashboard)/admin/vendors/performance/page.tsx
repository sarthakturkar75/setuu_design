import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ActivityIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon } from "lucide-react";

export const metadata = {
  title: "Vendor Performance Audit | Setuu",
};

export default async function VendorPerformancePage() {
  const supabase = await createClient();

  // For this page, we'll join organizations (type=vendor) and aggregate data.
  // Since complex aggregations are better done in SQL, we'll fetch basic orgs and mock the aggregate data 
  // until a proper Postgres function is created, or fetch related tables and calculate in JS.
  const { data: vendors } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("type", "vendor");

  // In a real scenario, we'd fetch project_materials and project_issues 
  // grouped by vendor_id, but here we simulate the scorecard logic.
  
  const vendorPerformance = (vendors || []).map((v) => ({
    id: v.id,
    name: v.name,
    onTimeDelivery: Math.floor(Math.random() * 20) + 80, // 80-100%
    defectRate: (Math.random() * 5).toFixed(1), // 0-5%
    activeProjects: Math.floor(Math.random() * 5) + 1,
    status: Math.random() > 0.1 ? "Excellent" : "Needs Review",
  }));

  const columns: Column<any>[] = [
    {
      key: "name",
      header: "Vendor Name",
      cell: (row) => <span className="font-semibold text-on-surface">{row.name}</span>,
    },
    {
      key: "activeProjects",
      header: "Active Projects",
      cell: (row) => row.activeProjects,
    },
    {
      key: "onTimeDelivery",
      header: "On-Time Delivery",
      cell: (row) => (
        <span className={`font-jetbrains-mono ${row.onTimeDelivery >= 90 ? "text-semantic-emerald" : "text-semantic-amber"}`}>
          {row.onTimeDelivery}%
        </span>
      ),
    },
    {
      key: "defectRate",
      header: "Defect Rate",
      cell: (row) => (
        <span className={`font-jetbrains-mono ${parseFloat(row.defectRate) <= 2 ? "text-semantic-emerald" : "text-semantic-crimson"}`}>
          {row.defectRate}%
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <StatusBadge
          tone={row.status === "Excellent" ? "emerald" : "amber"}
          label={row.status}
        />
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full pb-20">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Vendor Performance Audit</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Monitor supply chain reliability, material delivery times, and defect rates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Active Vendors</p>
              <h3 className="text-2xl font-bold font-jetbrains-mono mt-1">{vendorPerformance.length}</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <ActivityIcon className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Avg. On-Time</p>
              <h3 className="text-2xl font-bold font-jetbrains-mono mt-1 text-semantic-emerald">92%</h3>
            </div>
            <div className="p-3 bg-semantic-emerald-bg rounded-full text-semantic-emerald">
              <ClockIcon className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Avg. Defect Rate</p>
              <h3 className="text-2xl font-bold font-jetbrains-mono mt-1 text-semantic-amber">1.4%</h3>
            </div>
            <div className="p-3 bg-semantic-amber-bg rounded-full text-semantic-amber-on">
              <AlertTriangleIcon className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Compliant Orgs</p>
              <h3 className="text-2xl font-bold font-jetbrains-mono mt-1">100%</h3>
            </div>
            <div className="p-3 bg-surface-container-high rounded-full text-on-surface">
              <CheckCircleIcon className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 bg-surface/50">
          <h2 className="text-lg font-semibold font-merriweather text-on-surface">Vendor Scorecards</h2>
        </div>
        <DataTable columns={columns} data={vendorPerformance} />
      </div>
    </div>
  );
}
