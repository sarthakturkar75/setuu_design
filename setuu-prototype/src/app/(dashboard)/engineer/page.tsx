import * as React from "react";
import { KPICard } from "@/components/ui/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { 
  ListTodo, 
  Eye, 
  OctagonAlert,
  Cpu,
  Settings,
  Code2,
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default async function EngineerDashboard() {
  // Mock metrics
  const sprintTasks = 14;
  const pendingReviews = 5;
  const openBlockers = 2;

  // Mock cross-disciplinary task feed
  const activeTasks = [
    {
      id: "TSK-8902",
      title: "Implement Motor Controller Logic",
      discipline: "Software",
      project: "Alpha Assembly Line",
      due: "2026-08-15",
      status: "in_progress",
    },
    {
      id: "TSK-8841",
      title: "Verify Enclosure Thermal Stress",
      discipline: "Mechanical",
      project: "Alpha Assembly Line",
      due: "2026-08-14",
      status: "review",
    },
    {
      id: "TSK-8799",
      title: "Route PCB for Sensor Array",
      discipline: "Electrical",
      project: "Beta Testing Rig",
      due: "2026-08-16",
      status: "todo",
    }
  ];

  const getDisciplineIcon = (discipline: string) => {
    switch (discipline) {
      case "Software": return <Code2 className="w-4 h-4" />;
      case "Mechanical": return <Settings className="w-4 h-4" />;
      case "Electrical": return <Cpu className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "slate";
      case "in_progress": return "sky";
      case "review": return "purple";
      case "done": return "emerald";
      default: return "slate";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo": return "To Do";
      case "in_progress": return "In Progress";
      case "review": return "In Review";
      case "done": return "Done";
      default: return status;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* 12-Column KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Assigned Sprint Tasks"
          value={sprintTasks}
          trend={{ value: 3, label: "from last sprint", isPositive: true }}
          icon={<ListTodo className="w-5 h-5 text-semantic-sky" />}
        />
        <KPICard
          title="Pending Code/CAD Reviews"
          value={pendingReviews}
          trend={{ value: 2, label: "needs attention", isPositive: false }}
          icon={<Eye className="w-5 h-5 text-semantic-purple" />}
        />
        <KPICard
          title="Open Technical Blockers"
          value={openBlockers}
          trend={{ value: 1, label: "resolved today", isPositive: true }}
          icon={<OctagonAlert className="w-5 h-5 text-semantic-crimson" />}
        />
      </div>

      {/* Masonry Task Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-merriweather text-lg font-bold text-on-surface">Active Technical Tasks</h3>
          <Link href="/engineer/tasks" className="text-sm font-medium text-primary hover:underline flex items-center">
            View Board <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3 border-b border-outline-variant/30 flex flex-row justify-between items-start space-y-0">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-jetbrains-mono text-xs font-semibold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
                      {task.id}
                    </span>
                    <span className="flex items-center text-xs font-medium text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
                      {getDisciplineIcon(task.discipline)}
                      <span className="ml-1">{task.discipline}</span>
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold text-on-surface font-inter mt-2 line-clamp-2">
                    {task.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-on-surface-variant font-inter">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span className="font-jetbrains-mono text-xs">{task.due}</span>
                </div>
                <StatusBadge 
                  tone={getStatusColor(task.status) as any} 
                  label={getStatusLabel(task.status)} 
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}