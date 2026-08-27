import React from "react";
import { getDailyLogs } from "@/app/actions/dailyLogActions";
import { getProjectById } from "@/app/actions/projectActions";
import { FileTextIcon, CalendarIcon, CloudSunIcon, HardHatIcon, ClockIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { GenerateLogButton } from "@/components/ui/GenerateLogButton";
import { DeleteDailyLogButton } from "@/components/ui/DeleteDailyLogButton";

export default async function DailyLogsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  const logs = await getDailyLogs(id);

  const today = new Date().toISOString().split("T")[0];
  const hasLogToday = logs.some((l) => l.date === today);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-merriweather text-on-surface">
            Daily Project Logs
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Automated AI synthesis of project updates, labor timesheets, and weather conditions for {project?.name}.
          </p>
        </div>
        <GenerateLogButton projectId={id} date={today} hasLogToday={hasLogToday} />
      </div>

      <div className="space-y-8">
        {logs.length === 0 ? (
          <div className="text-center p-16 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant text-on-surface-variant flex flex-col items-center">
            <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mb-4">
              <FileTextIcon className="w-8 h-8 text-on-surface-variant opacity-70" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-1">No logs generated yet</h3>
            <p className="text-sm max-w-md">
              At the end of each day, generate a daily log. The AI will automatically read all progress photos, timesheets, and issues from the day to write a professional executive summary.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-elevation-l1"
            >
              {/* Log Header */}
              <div className="bg-surface px-6 py-5 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-on-surface leading-tight">
                      {new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">Report ID: {log.id.split('-')[0]}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                  <DeleteDailyLogButton logId={log.id} />
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-variant rounded-lg text-on-surface-variant">
                    <CloudSunIcon className="w-4 h-4" />
                    {log.weather_summary_json?.temperature ? `${log.weather_summary_json.temperature}°C` : "--°"}
                    {log.weather_summary_json?.conditions ? ` • ${log.weather_summary_json.conditions}` : ""}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-tertiary-container/30 text-on-tertiary-container rounded-lg">
                    <HardHatIcon className="w-4 h-4" />
                    {log.labor_hours_total} Total Hrs
                  </div>
                </div>
              </div>
              
              {/* Log Content - Markdown */}
              <div className="p-8 prose prose-slate prose-headings:font-merriweather prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant prose-strong:text-on-surface max-w-none dark:prose-invert">
                <ReactMarkdown>{log.ai_generated_report || "*No content generated.*"}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
