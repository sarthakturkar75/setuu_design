"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getTimesheets, logTimeEntry } from "@/app/actions/timesheetActions";
import { getProjects } from "@/app/actions/projectActions";
import { Toast, toast } from "@/components/ui/Toast";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function EngineerTimesheet() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Weekly grid state (simplified for prototype)
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const [projData, timeData] = await Promise.all([
          getProjects(),
          getTimesheets(new Date().toISOString(), new Date().toISOString())
        ]);
        setProjects(projData || []);
        setTimesheets(timeData || []);
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const handleSubmitWeek = async () => {
    toast.success("Timesheet submitted for approval.");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Timesheet Logger" subtitle="Log your hours across active projects." />
      
      <div className="flex justify-between items-center bg-surface-container p-4 rounded-lg">
        <Button variant="outline" onClick={() => {
          const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d);
        }}>Previous Week</Button>
        <div className="font-bold text-on-surface text-lg">
          Week of {currentDate.toLocaleDateString()}
        </div>
        <Button variant="outline" onClick={() => {
          const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d);
        }}>Next Week</Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center animate-pulse">Loading timesheets...</div>
        ) : (
          <table className="w-full text-left text-sm text-on-surface">
            <thead className="bg-surface-variant text-on-surface-variant font-semibold">
              <tr>
                <th className="p-4 border-b border-outline-variant/30">Project</th>
                <th className="p-4 border-b border-outline-variant/30 text-center">Mon</th>
                <th className="p-4 border-b border-outline-variant/30 text-center">Tue</th>
                <th className="p-4 border-b border-outline-variant/30 text-center">Wed</th>
                <th className="p-4 border-b border-outline-variant/30 text-center">Thu</th>
                <th className="p-4 border-b border-outline-variant/30 text-center">Fri</th>
                <th className="p-4 border-b border-outline-variant/30 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {projects.slice(0, 3).map(p => (
                <tr key={p.id} className="hover:bg-surface-variant/50 transition-colors">
                  <td className="p-4 font-medium">{p.name}</td>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <td key={i} className="p-4 text-center">
                      <input 
                        type="number" 
                        min="0" max="24"
                        className="w-16 bg-surface-container border border-outline rounded p-1 text-center" 
                        defaultValue={0} 
                      />
                    </td>
                  ))}
                  <td className="p-4 text-center">
                    <StatusBadge tone="slate" label="Draft" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="p-4 border-t border-outline-variant/30 flex justify-end">
          <Button onClick={handleSubmitWeek}>Submit Week for Approval</Button>
        </div>
      </Card>
    </div>
  );
}
