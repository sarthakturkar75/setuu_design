import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

export const metadata = {
  title: "Allocation Analytics | Setuu",
};

export default async function ResourceAnalyticsPage() {
  const supabase = await createClient();

  const { data: resources } = await supabase
    .from("project_resources")
    .select(`
      id,
      name,
      allocated_hours,
      actual_hours,
      projects(name)
    `)
    .order("name", { ascending: true });

  const analytics = (resources || []).map((r: any) => {
    const allocated = r.allocated_hours || 0;
    const actual = r.actual_hours || 0;
    // Calculate percentage, capping at 120% for visual scale
    const percentage = allocated > 0 ? (actual / allocated) * 100 : 0;
    const displayPercentage = Math.min(percentage, 120);
    const isOverAllocated = actual > allocated;

    return {
      id: r.id,
      name: r.name,
      project: r.projects?.name || "Unassigned",
      allocated,
      actual,
      percentage,
      displayPercentage,
      isOverAllocated,
    };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full pb-20">
      <div className="space-y-4">
        <Link 
          href="/admin/resources"
          className="inline-flex items-center text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back to Resources
        </Link>
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Allocation Analytics</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Visual comparison of actual hours burned versus initial allocation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analytics.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <CardDescription className="truncate">{item.project}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm font-jetbrains-mono">
                <span className="text-on-surface-variant">Allocated: {item.allocated}h</span>
                <span className={item.isOverAllocated ? "text-semantic-crimson font-bold" : "text-semantic-emerald"}>
                  Actual: {item.actual}h
                </span>
              </div>
              
              {/* Micro bar chart */}
              <div className="relative w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                    item.isOverAllocated ? "bg-semantic-crimson" : "bg-semantic-emerald"
                  }`}
                  style={{ width: `${item.displayPercentage}%` }}
                />
                {/* 100% marker line */}
                <div className="absolute top-0 left-[83.33%] w-0.5 h-full bg-outline-variant z-10" title="100% Allocation Marker" />
              </div>
              
              <div className="text-right">
                <span className={`text-xs font-semibold ${item.isOverAllocated ? "text-semantic-crimson" : "text-on-surface-variant"}`}>
                  {item.percentage.toFixed(1)}% burned
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
