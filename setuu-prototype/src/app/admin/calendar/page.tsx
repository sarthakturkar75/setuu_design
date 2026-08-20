"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { CalendarIcon } from "lucide-react";

export default function CalendarPage() {
    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <PageHeader 
                title="Global Calendar" 
                subtitle="View all upcoming project milestones and team schedules"
            />
            <div className="bg-surface-container rounded-xl border border-outline-variant/50 p-12 text-center text-on-surface-variant flex flex-col items-center justify-center min-h-[400px]">
                <CalendarIcon className="w-12 h-12 mb-4 opacity-50 text-primary" />
                <h3 className="text-xl font-semibold mb-2 text-on-surface">Calendar Integration Pending</h3>
                <p className="max-w-md mx-auto">
                    Global scheduling, timeline aggregation, and event syncing will be available in an upcoming release. 
                    For now, view individual project timelines in their respective workspaces.
                </p>
            </div>
        </div>
    );
}
