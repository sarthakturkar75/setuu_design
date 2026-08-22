import { getPublicProjectData } from "@/app/actions/publicShareActions";
import { KPICard } from "@/components/ui/KPICard";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CheckCircle, Clock, AlertOctagon } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PublicProjectPage({
  params
}: {
  params: Promise<{ secure_token: string }>;
}) {
  const { secure_token } = await params;
  
  const data = await getPublicProjectData(secure_token);

  if (data.error || !data.project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertOctagon className="w-12 h-12 text-semantic-crimson mb-4" />
        <h2 className="text-xl font-bold text-on-surface mb-2">Link Expired or Invalid</h2>
        <p className="text-on-surface-variant text-center max-w-md">
          {data.error || "This public dashboard link is no longer valid. Please contact the Project Manager for a new link."}
        </p>
      </div>
    );
  }

  const { project, milestones } = data;
  const totalMilestones = milestones?.length || 0;
  const completedMilestones = (milestones || []).filter((m: any) => m.completion_status === true || m.status_label === 'Completed').length;
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-merriweather font-bold text-on-surface">{project.name}</h1>
        <p className="text-on-surface-variant mt-2">{project.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Project Progress" 
          value={`${progress}%`} 
          icon={<CheckCircle className="w-5 h-5" />} 
          semanticColor="emerald"
        />
        <KPICard 
          title="Status" 
          value={project.status || 'Active'} 
          icon={<Clock className="w-5 h-5" />} 
          semanticColor="sky"
        />
        <KPICard 
          title="Completed Milestones" 
          value={`${completedMilestones} / ${totalMilestones}`} 
          icon={<CheckCircle className="w-5 h-5" />} 
          semanticColor="emerald"
        />
      </div>

      <Card className="p-6">
        <h3 className="font-merriweather text-lg font-bold text-on-surface mb-6">Milestone Tracker</h3>
        <div className="space-y-6">
          {(milestones || []).length === 0 ? (
            <p className="text-sm text-on-surface-variant">No milestones have been defined yet.</p>
          ) : (
            (milestones || []).map((m: any, i: number) => {
              const isCompleted = m.completion_status === true || m.status_label === 'Completed';
              const mProgress = isCompleted ? 100 : (m.weight_percent || 0);
              const color = isCompleted ? 'semantic-emerald' : m.status_label === 'Overdue' ? 'semantic-crimson' : 'semantic-sky';
              return (
                <div key={m.id || i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-on-surface">{m.title}</span>
                    <span className={`text-sm font-jetbrains font-bold text-${color}`}>{mProgress}%</span>
                  </div>
                  <div className={`[&>div]:bg-${color}`}>
                    <ProgressBar progress={mProgress} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
