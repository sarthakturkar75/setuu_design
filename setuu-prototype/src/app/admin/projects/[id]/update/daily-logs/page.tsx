import React from "react";
import {
  getDailyLogs,
  generateDailyReport,
} from "@/app/actions/dailyLogActions";
import { getProjectById } from "@/app/actions/projectActions";
import { Button } from "@/components/ui/Button";
import {
  FileTextIcon,
  CalendarIcon,
  PlusCircleIcon,
  CloudSunIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { revalidatePath } from "next/cache";

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
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-merriweather text-on-surface">
            Daily Site Logs
          </h2>
          <p className="text-on-surface-variant">
            Automated AI synthesis of site updates, labor, and weather.
          </p>
        </div>
        {!hasLogToday && (
          <form
            action={async () => {
              "use server";
              await generateDailyReport(id, today);
              revalidatePath(`/admin/projects/${id}/update/daily-logs`);
            }}
          >
            <Button variant="primary" type="submit" className="gap-2">
              <PlusCircleIcon className="w-4 h-4" /> Generate Today's Log
            </Button>
          </form>
        )}
      </div>

      <div className="space-y-6">
        {logs.length === 0 ? (
          <div className="text-center p-12 bg-surface-container rounded-xl border border-outline-variant text-on-surface-variant">
            <FileTextIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No daily logs generated yet.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm"
            >
              <div className="bg-surface-container px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-semantic-indigo" />
                  <h3 className="font-semibold text-lg">
                    {new Date(log.date).toLocaleDateString()}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <CloudSunIcon className="w-4 h-4" />{" "}
                    {log.weather_summary_json?.temperature || "--"}°C
                  </span>
                  <span>Labor: {log.labor_hours_total} hrs</span>
                </div>
              </div>
              <div className="p-6 prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{log.ai_generated_report || ""}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
