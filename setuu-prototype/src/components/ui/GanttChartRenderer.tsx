"use client";

import React, { useMemo } from "react";
import { Tooltip } from "@/components/ui/Tooltip";

export function GanttChartRenderer({ tasks }: { tasks: any[] }) {
  const { minDate, maxDate, totalDays } = useMemo(() => {
    if (!tasks || tasks.length === 0)
      return {
        minDate: new Date().getTime(),
        maxDate: new Date().getTime() + 86400000,
        totalDays: 1,
      };

    let min = new Date("2100-01-01").getTime();
    let max = new Date("1970-01-01").getTime();

    tasks.forEach((t) => {
      const ps = t.planned_start_date
        ? new Date(t.planned_start_date).getTime()
        : new Date(t.created_at).getTime();
      const pf = t.planned_finish_date
        ? new Date(t.planned_finish_date).getTime()
        : ps + 86400000;
      const as = t.actual_start_date
        ? new Date(t.actual_start_date).getTime()
        : ps;
      const af = t.actual_finish_date
        ? new Date(t.actual_finish_date).getTime()
        : pf;

      if (ps < min) min = ps;
      if (as < min) min = as;
      if (pf > max) max = pf;
      if (af > max) max = af;
    });

    // Add a 5-day visual buffer to the start and end
    min -= 5 * 86400000;
    max += 5 * 86400000;
    const days = Math.ceil((max - min) / 86400000);

    return { minDate: min, maxDate: max, totalDays: days };
  }, [tasks]);

  const calculatePosition = (startMs: number, finishMs: number) => {
    const left = ((startMs - minDate) / (maxDate - minDate)) * 100;
    let width = ((finishMs - startMs) / (maxDate - minDate)) * 100;
    if (width < 0.5) width = 0.5; // Minimum visible width
    return { left: `${left}%`, width: `${width}%` };
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-8 text-center text-on-surface-variant border border-dashed rounded-xl bg-surface-variant/10">
        No tasks available to render.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-surface border border-outline-variant/50 rounded-xl shadow-sm h-full flex flex-col">
      <div className="min-w-[800px] flex-1 flex flex-col">
        {/* Header / Timeline Axis */}
        <div className="flex border-b border-outline-variant/50 bg-surface-container-lowest p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider sticky top-0 z-10">
          <div className="w-1/3 shrink-0 pr-4 border-r border-outline-variant/30">
            Task Details
          </div>
          <div className="flex-1 relative h-4 ml-4">
            <span className="absolute left-0 -top-1">
              {new Date(minDate).toLocaleDateString()}
            </span>
            <span className="absolute right-0 -top-1">
              {new Date(maxDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Task Rows */}
        <div className="flex flex-col divide-y divide-outline-variant/30 flex-1 overflow-y-auto">
          {tasks.map((task) => {
            // Planned Timeline (Baseline)
            const ps = task.planned_start_date
              ? new Date(task.planned_start_date).getTime()
              : new Date(task.created_at).getTime();
            const pf = task.planned_finish_date
              ? new Date(task.planned_finish_date).getTime()
              : ps + 86400000;
            const plannedPos = calculatePosition(ps, pf);

            // Actual Timeline (Execution)
            const as = task.actual_start_date
              ? new Date(task.actual_start_date).getTime()
              : ps;
            const af = task.actual_finish_date
              ? new Date(task.actual_finish_date).getTime()
              : task.status === "Completed"
                ? pf
                : Date.now();
            const actualPos = calculatePosition(as, af);
            const progress = task.actual_percent_complete || 0;

            const isDelayed = task.delay_days && task.delay_days > 0;

            return (
              <div
                key={task.id}
                className="flex p-4 hover:bg-surface-variant/10 transition-colors items-center group"
              >
                {/* Task Meta */}
                <div className="w-1/3 shrink-0 pr-4 flex flex-col border-r border-outline-variant/30">
                  <span className="text-sm font-semibold text-on-surface line-clamp-1">
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono bg-surface-variant px-1.5 py-0.5 rounded text-on-surface-variant">
                      {task.display_id || task.id.substring(0, 6)}
                    </span>
                    <span className="text-[10px] text-on-surface-variant bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      {task.department || "General"}
                    </span>
                  </div>
                </div>

                {/* Timeline Grid */}
                <div className="flex-1 relative h-10 ml-4 border-l border-outline-variant/20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:5%]">
                  {/* 1. Baseline Bar (Gray, Background) */}
                  <div
                    className="absolute top-1 h-3 rounded-full bg-outline-variant/40 border border-outline-variant/50"
                    style={{ left: plannedPos.left, width: plannedPos.width }}
                    title={`Planned: ${new Date(ps).toLocaleDateString()} - ${new Date(pf).toLocaleDateString()}`}
                  />

                  {/* 2. Actual Bar (Foreground, Colored by Status) */}
                  <Tooltip
                    content={`Actual: ${new Date(as).toLocaleDateString()} - ${new Date(af).toLocaleDateString()} (${progress}%)`}
                  >
                    <div
                      className={`absolute top-5 h-4 rounded shadow-sm overflow-hidden flex items-center ${isDelayed ? "bg-semantic-crimson/20 border-semantic-crimson/50" : "bg-primary/20 border-primary/50"} border`}
                      style={{ left: actualPos.left, width: actualPos.width }}
                    >
                      {/* 3. Progress Fill */}
                      <div
                        className={`h-full transition-all duration-500 ease-out ${isDelayed ? "bg-semantic-crimson" : "bg-primary"}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
