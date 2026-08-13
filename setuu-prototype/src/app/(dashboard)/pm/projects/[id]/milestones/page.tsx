import { createClient } from "@/lib/supabase/server";
import { CheckCircle2Icon, CircleIcon, ClockIcon, AlertCircleIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const metadata = {
  title: "Milestones | Setuu",
};

export default async function MilestonesPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // Fetch milestones
  const { data: milestones } = await supabase
    .from("milestones")
    .select(`
      id,
      name,
      target_date,
      status,
      checklist:milestone_checklist_items(id, item_text, is_completed)
    `)
    .eq("project_id", params.id)
    .order("target_date", { ascending: true });

  return (
    <div className="p-6 max-w-[100rem] mx-auto w-full pb-20">
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold font-inter text-on-surface tracking-tight">Milestone Execution Hub</h1>
          <p className="text-sm text-on-surface-variant font-inter mt-1">Track phase completion and granular field checklists.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Master List */}
        <div className="xl:col-span-1 space-y-4 h-[calc(100vh-14rem)] overflow-y-auto pr-2">
          {(milestones || []).map((m: any, index: number) => {
            const completedCount = m.checklist?.filter((c: any) => c.is_completed).length || 0;
            const totalCount = m.checklist?.length || 0;
            const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
            
            return (
              <div 
                key={m.id} 
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-primary/50 group ${index === 0 ? 'bg-primary/5 border-primary shadow-sm' : 'bg-surface border-outline-variant hover:bg-surface-container'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-on-surface group-hover:text-primary transition-colors">{m.name}</h3>
                  <StatusBadge 
                    tone={m.status === "Completed" ? "emerald" : m.status === "In Progress" ? "sky" : "slate"} 
                    label={m.status || "Pending"} 
                  />
                </div>
                
                <div className="flex items-center gap-2 text-xs text-on-surface-variant font-jetbrains-mono mb-4">
                  <ClockIcon className="w-3.5 h-3.5" />
                  Due: {new Date(m.target_date).toLocaleDateString()}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>{completedCount} of {totalCount} tasks</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-semantic-emerald' : 'bg-primary'}`} 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>
              </div>
            );
          })}
          
          {(!milestones || milestones.length === 0) && (
            <div className="p-8 text-center bg-surface-container border border-outline-variant rounded-xl border-dashed">
              <p className="text-sm text-on-surface-variant">No milestones defined for this project.</p>
            </div>
          )}
        </div>

        {/* Detail Pane */}
        <div className="xl:col-span-2">
          {milestones && milestones.length > 0 ? (
            <Card className="h-full border-outline-variant/50 shadow-sm">
              <CardHeader className="border-b border-outline-variant/30 pb-4 bg-surface-container/20">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-1">{milestones[0].name}</CardTitle>
                    <p className="text-sm text-on-surface-variant flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" /> Target: <span className="font-jetbrains-mono">{new Date(milestones[0].target_date).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-colors shadow-sm">
                    Mark Phase Complete
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-4">Execution Checklist</h4>
                
                <div className="space-y-3">
                  {milestones[0].checklist?.map((item: any) => (
                    <div 
                      key={item.id} 
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container transition-colors group cursor-pointer"
                    >
                      <button className="mt-0.5 text-on-surface-variant group-hover:text-primary transition-colors focus:outline-none">
                        {item.is_completed ? (
                          <CheckCircle2Icon className="w-5 h-5 text-semantic-emerald" />
                        ) : (
                          <CircleIcon className="w-5 h-5 text-outline-variant group-hover:text-primary" />
                        )}
                      </button>
                      <span className={`text-sm ${item.is_completed ? 'text-on-surface-variant line-through' : 'text-on-surface font-medium'}`}>
                        {item.item_text}
                      </span>
                    </div>
                  ))}
                  
                  {(!milestones[0].checklist || milestones[0].checklist.length === 0) && (
                    <div className="py-6 flex items-center justify-center gap-2 text-sm text-on-surface-variant bg-surface-container/50 rounded-lg border border-outline-variant/30 border-dashed">
                      <AlertCircleIcon className="w-4 h-4" />
                      No checklist items defined for this phase.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-outline-variant rounded-xl bg-surface-container/20">
              <p className="text-on-surface-variant font-medium">Select a milestone to view checklist</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
