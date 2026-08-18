"use client";
import Link from "next/link";
import * as React from "react";
import { TimelineEntry } from "@/components/ui/TimelineEntry";
import { CameraIcon, PenToolIcon, CheckCircleIcon } from "lucide-react";

export default function ProjectTimelinePage({ params }: { params?: { id: string } }) {
  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-merriweather text-on-surface">Timeline & Updates</h2>
        <Link href={`/pm/projects/${params?.id}/update`} className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors">
          <CameraIcon className="w-4 h-4" />
          Post Site Update
        </Link>
      </div>

      <div className="relative pl-8 border-l-2 border-outline-variant/30 space-y-8">

        <div className="relative">
          <div className="absolute -left-[41px] top-0 p-1.5 bg-semantic-emerald-bg rounded-full border-4 border-surface">
            <CheckCircleIcon className="w-4 h-4 text-semantic-emerald-on" />
          </div>
          <TimelineEntry
            timestamp="Today, 10:30 AM"
            action="signed off on the foundation pouring for Block A."
            description="The client and structural engineer have both signed off on the foundation pouring for Block A."
            actorName="Michael Chen (Project Manager)"
          />
        </div>

        <div className="relative">
          <div className="absolute -left-[41px] top-0 p-1.5 bg-primary/10 rounded-full border-4 border-surface">
            <CameraIcon className="w-4 h-4 text-primary" />
          </div>
          <TimelineEntry
            timestamp="Yesterday, 2:15 PM"
            action="posted a Site Progress Update"
            description="Rebar installation completed for the western wing."
            actorName="David Miller (Site Supervisor)"
            mediaUrls={[
              "https://images.unsplash.com/photo-1541888086225-245ed786e246?w=400&q=80",
              "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80"
            ]}
          />
        </div>

        <div className="relative">
          <div className="absolute -left-[41px] top-0 p-1.5 bg-semantic-amber-bg rounded-full border-4 border-surface">
            <PenToolIcon className="w-4 h-4 text-semantic-amber-on" />
          </div>
          <TimelineEntry
            timestamp="Aug 14, 2026"
            action="drafted a Change Request"
            description="Change in HVAC duct routing due to unforeseen structural beam."
            actorName="Sarah Jenkins (Lead Engineer)"
            isLast={true}
          />
        </div>

      </div>
    </div>
  );
}
