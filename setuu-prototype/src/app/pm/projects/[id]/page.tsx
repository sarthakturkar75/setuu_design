"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import { KPICard } from "@/components/ui/KPICard";
import { BarChart } from "@/components/ui/BarChart";
import { AlertTriangleIcon, CheckCircleIcon, ClockIcon } from "lucide-react";

export default function ProjectDashboardPage() {
    const params = useParams();
    const id = params?.id as string;

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title="Overall Progress"
                    value="68%"
                    trend={{ value: 4, label: "from last week", isPositive: true }}
                    icon={<CheckCircleIcon className="w-5 h-5 text-semantic-emerald" />}
                />
                <KPICard
                    title="Days to Deadline"
                    value="45"
                    icon={<ClockIcon className="w-5 h-5 text-semantic-amber" />}
                />
                <KPICard
                    title="Open Critical Issues"
                    value="2"
                    trend={{ value: 1, label: "new this week", isPositive: false }}
                    icon={<AlertTriangleIcon className="w-5 h-5 text-semantic-crimson" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface-container rounded-xl border border-outline-variant p-6 space-y-4">
                    <h2 className="text-lg font-bold font-merriweather text-on-surface">
                        Milestone Progress
                    </h2>
                    <div className="h-64">
                        <BarChart
                            data={[
                                { name: "Foundation", completion: 100 },
                                { name: "Structure", completion: 80 },
                                { name: "MEP Rough-in", completion: 40 },
                                { name: "Finishes", completion: 0 },
                            ]}
                            keys={["completion"]}
                            colors={["#0ea5e9"]}
                            xAxisKey="name"
                        />
                    </div>
                </div>

                <div className="bg-surface-container rounded-xl border border-outline-variant p-6 space-y-4">
                    <h2 className="text-lg font-bold font-merriweather text-on-surface">
                        Recent Activity
                    </h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-2 h-2 mt-2 rounded-full bg-semantic-emerald shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-on-surface">
                                    Concrete poured for Block B
                                </p>
                                <p className="text-xs text-on-surface-variant">
                                    2 hours ago by Site Supervisor
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-2 h-2 mt-2 rounded-full bg-semantic-crimson shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-on-surface">
                                    Issue logged: Rebar delivery delayed
                                </p>
                                <p className="text-xs text-on-surface-variant">
                                    Yesterday by Inventory Manager
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
