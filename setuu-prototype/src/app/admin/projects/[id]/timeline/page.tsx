"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GanttChartRenderer } from "@/components/ui/GanttChartRenderer";
import { 
  getTimelineData, 
  setScheduleBaseline, 
  calculateWeatherDelays, 
  checkResourceAllocation,
  cloneTimelineToScenario, 
  importProjectSchedule
} from "@/app/actions/timelineActions";
import { autoLevelResources } from "@/app/actions/timelineLeveling";
import { CameraIcon, Target, CloudRain, Users, FlaskConical, Upload, Save } from "lucide-react";

export default function ProjectTimelinePage() {
  const params = useParams();
  const [milestones, setMilestones] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sandboxMode, setSandboxMode] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState("");

  React.useEffect(() => {
    async function load() {
      const pid = params?.id as string;
      if(!pid) return;
      try {
        const data = await getTimelineData(pid);
        setMilestones(data.milestones || []);
      } catch (err) {
        console.error("Failed to load timeline", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params?.id]);

  const handleAction = async (actionName: string, actionFn: () => Promise<any>) => {
    setActionLoading(actionName);
    try {
      await actionFn();
      // Reload timeline data after action
      const data = await getTimelineData(params?.id as string);
      setMilestones(data.milestones || []);
      alert(`${actionName} completed successfully.`);
    } catch(err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading("");
    }
  };

  const handleBaseline = () => handleAction("Setting Baseline", () => setScheduleBaseline(params?.id as string));
  
  const handleWeather = () => handleAction("Weather Check", async () => {
    const res = await calculateWeatherDelays(params?.id as string);
    if(res.delayDetected) {
      // In a real app, open a modal. Here we auto-approve for the prototype.
      alert(`Heavy rain detected! Shifting ${res.affectedMilestones.length} exterior tasks by 3 days.`);
    } else {
      alert("No critical weather delays detected.");
    }
  });

  const handleResource = () => handleAction("Resource Leveling", async () => {
    const conflicts = await checkResourceAllocation(params?.id as string);
    if(conflicts.length > 0) {
      const res = await autoLevelResources(params?.id as string);
      alert(`Found ${conflicts.length} resource conflicts. Auto-leveled and shifted ${res.shiftedCount} tasks.`);
    } else {
      alert("No resource conflicts found. Schedule is balanced.");
    }
  });

  const handleSandbox = () => {
    if(!sandboxMode) {
      handleAction("Creating Sandbox", async () => {
        await cloneTimelineToScenario(params?.id as string, `Sandbox ${new Date().toISOString()}`);
        setSandboxMode(true);
      });
    } else {
      setSandboxMode(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setActionLoading("Importing");
    try {
      const text = await file.text();
      await importProjectSchedule(params?.id as string, text);
      const data = await getTimelineData(params?.id as string);
      setMilestones(data.milestones || []);
      alert("Schedule imported successfully.");
    } catch (err: any) {
      alert("Failed to import schedule: " + err.message);
    } finally {
      setActionLoading("");
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-merriweather text-on-surface flex items-center gap-2">
            Timeline & CPM Schedule
            {sandboxMode && <span className="bg-semantic-amber text-semantic-amber-on text-xs px-2 py-1 rounded font-jetbrains">SANDBOX MODE</span>}
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">Interactive Gantt chart, baseline tracking, and resource leveling.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <button onClick={handleSandbox} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors border ${sandboxMode ? 'bg-semantic-amber text-semantic-amber-on border-semantic-amber' : 'bg-surface hover:bg-surface-variant/30 border-outline-variant/30 text-on-surface'}`}>
             <FlaskConical className="w-4 h-4" />
             {actionLoading === "Creating Sandbox" ? "Branching..." : sandboxMode ? "Exit Sandbox" : "Sandbox Mode"}
           </button>
           <button onClick={handleWeather} className="flex items-center gap-2 px-3 py-2 bg-surface hover:bg-surface-variant/30 border border-outline-variant/30 rounded-md text-sm font-medium text-on-surface transition-colors">
             <CloudRain className="w-4 h-4 text-semantic-sky" />
             Weather Sync
           </button>
           <button onClick={handleResource} className="flex items-center gap-2 px-3 py-2 bg-surface hover:bg-surface-variant/30 border border-outline-variant/30 rounded-md text-sm font-medium text-on-surface transition-colors">
             <Users className="w-4 h-4 text-semantic-emerald" />
             Auto-Level
           </button>
           <button onClick={handleBaseline} className="flex items-center gap-2 px-3 py-2 bg-surface hover:bg-surface-variant/30 border border-outline-variant/30 rounded-md text-sm font-medium text-on-surface transition-colors">
             <Target className="w-4 h-4 text-semantic-crimson" />
             {actionLoading === "Setting Baseline" ? "Saving..." : "Set Baseline"}
           </button>
           <label className="flex items-center gap-2 px-3 py-2 bg-primary text-white hover:bg-primary/90 rounded-md text-sm font-medium transition-colors cursor-pointer shadow-glow">
             <Upload className="w-4 h-4" />
             {actionLoading === "Importing" ? "Importing..." : "Import .mpp"}
             <input type="file" className="hidden" accept=".mpp,.xml" onChange={handleImport} />
           </label>
        </div>
      </div>

      {loading ? (
        <div className="h-96 w-full flex items-center justify-center bg-surface border border-outline-variant/30 rounded-lg animate-pulse">
           <span className="text-on-surface-variant">Loading Schedule Engine...</span>
        </div>
      ) : (
        <div className="relative">
           {sandboxMode && (
              <div className="absolute inset-0 border-4 border-semantic-amber rounded-lg pointer-events-none z-10 opacity-50" />
           )}
           <GanttChartRenderer 
             tasks={milestones} 
             onTasksChange={(tasks) => console.log('Tasks updated locally', tasks)}
           />
        </div>
      )}
    </div>
  );
}
