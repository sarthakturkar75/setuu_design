"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Users, Truck, Wrench, Replace, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getGlobalResourceAnalytics, reallocateResource } from "@/app/actions/resourceActions";
import { getProjects } from "@/app/actions/projectActions";
import { useToast } from "@/contexts/ToastContext";

export default function ResourceAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("workforce");
  const [analytics, setAnalytics] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [targetProject, setTargetProject] = useState("");
  const [resourceId, setResourceId] = useState("");
  const toast = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const [anData, projData] = await Promise.all([
          getGlobalResourceAnalytics(),
          getProjects()
        ]);
        setAnalytics(anData);
        setProjects(projData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleReallocate = async () => {
    if (!resourceId || !targetProject) return toast.error("Please select a resource and a target project.");
    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("resource_id", resourceId);
    fd.append("target_project_id", targetProject);
    const res = await reallocateResource(fd);
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Resource reallocated successfully.");
      setResourceId("");
      setTargetProject("");
      const anData = await getGlobalResourceAnalytics();
      setAnalytics(anData);
    } else {
      toast.error(res.error || "Failed to reallocate");
    }
  };

  const columns = [
    { key: "project_name", header: "Project", cell: (row: any) => <span className="font-semibold text-on-surface">{row.project_name}</span> },
    { key: "resource_name", header: "Resource", cell: (row: any) => <span className="text-on-surface-variant font-medium">{row.resource_name}</span> },
    { key: "type", header: "Type", cell: (row: any) => <span className="text-sm px-2 py-0.5 bg-surface-variant rounded text-on-surface-variant">{row.type}</span> },
    { key: "variance", header: "Variance", cell: (row: any) => <span className="font-jetbrains font-bold text-crimson">+{row.variance} hrs</span> },
    { 
      key: "actions", 
      header: "", 
      cell: (row: any) => {
        return (
          <button 
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-variant`}
          >
            Review Issue
          </button>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Advanced Resource Analytics" 
        subtitle="AI-driven workforce density mapping and conflict resolution"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/pm" className="hover:text-primary transition-colors">PM</Link>
            <span>/</span>
            <Link href="/pm/resources" className="hover:text-primary transition-colors">Resources</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Analytics</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <Link href="/pm/resources" className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Hub
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-crimson/10 text-crimson border border-crimson/20 rounded-lg text-sm font-semibold hover:bg-crimson/20 transition-colors">
              <ShieldAlert className="w-4 h-4" />
              Log Blocker
            </button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1800px] mx-auto w-full flex flex-col gap-6">
        
        {loading ? (
          <div className="text-center p-12 text-on-surface-variant animate-pulse">Loading analytics data...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conflicts Summary */}
              <Card className="col-span-1 lg:col-span-2 p-6 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-on-surface">Resource Overallocation Summary</h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                    <AlertTriangle className="w-4 h-4 text-semantic-amber" /> Real-time tracking
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 flex-1">
                   <div className="bg-surface-variant/30 rounded-xl p-6 border border-outline-variant/50 flex flex-col items-center justify-center text-center">
                     <span className="text-4xl font-black text-semantic-amber mb-2 font-jetbrains">{analytics?.conflicts?.length || 0}</span>
                     <span className="text-on-surface-variant font-medium">Active Conflicts</span>
                     <p className="text-xs text-on-surface-variant/60 mt-2 max-w-[200px]">Resources exceeding their allocated operational hours</p>
                   </div>
                   <div className="bg-surface-variant/30 rounded-xl p-6 border border-outline-variant/50 flex flex-col items-center justify-center text-center">
                     <span className="text-4xl font-black text-crimson mb-2 font-jetbrains">{analytics?.totalVariance > 0 ? '+' : ''}{analytics?.totalVariance || 0}</span>
                     <span className="text-on-surface-variant font-medium">Total Variance (hrs)</span>
                     <p className="text-xs text-on-surface-variant/60 mt-2 max-w-[200px]">Cumulative hour overruns across the portfolio</p>
                   </div>
                </div>
              </Card>

              {/* Quick Reallocation Panel */}
              <Card className="col-span-1 flex flex-col p-0 overflow-hidden">
                <div className="p-4 border-b border-outline-variant bg-surface-variant/30">
                  <h3 className="font-semibold text-on-surface flex items-center gap-2">
                    <Replace className="w-4 h-4 text-primary" /> Quick Reallocation
                  </h3>
                </div>

                <div className="flex-1 p-4 flex flex-col gap-4 bg-surface">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Select Conflicting Resource</label>
                    <select 
                      className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface focus:border-primary outline-none"
                      value={resourceId}
                      onChange={(e) => setResourceId(e.target.value)}
                    >
                      <option value="">-- Select Resource --</option>
                      {analytics?.conflicts?.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.resource_name} ({c.project_name})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1 mt-2">
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Target Project</label>
                    <select 
                      className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface focus:border-primary outline-none"
                      value={targetProject}
                      onChange={(e) => setTargetProject(e.target.value)}
                    >
                      <option value="">-- Select Project --</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-auto pt-6">
                    <button 
                      onClick={handleReallocate}
                      disabled={isSubmitting || !resourceId || !targetProject}
                      className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-elevation-l1 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Replace className="w-4 h-4" /> {isSubmitting ? "Executing..." : "Execute Transfer"}
                    </button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Active Resource Conflicts Table */}
            <Card className="flex flex-col">
              <div className="p-4 border-b border-outline-variant flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-semantic-amber" />
                <h3 className="font-semibold text-on-surface">Active Resource Conflicts</h3>
              </div>
              <DataTable 
                data={analytics?.conflicts || []}
                columns={columns}
                getRowId={(row: any) => row.id}
              />
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
