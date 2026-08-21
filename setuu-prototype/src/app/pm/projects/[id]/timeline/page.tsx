"use client";
import Link from "next/link";
import * as React from "react";
import { TimelineEntry } from "@/components/ui/TimelineEntry";
import { CameraIcon, PenToolIcon, CheckCircleIcon, MilestoneIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { getUpdates } from "@/app/actions/updateActions";
import { getProjectMilestones } from "@/app/actions/milestoneActions";
import { getChangeRequests } from "@/app/actions/changeRequestActions";

export default function ProjectTimelinePage() {
  const params = useParams();
  const [timeline, setTimeline] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    async function load() {
      const pid = params?.id as string;
      if(!pid) return;
      try {
        const [updatesRes, milestonesRes, changesRes] = await Promise.all([
          getUpdates({ projectId: pid }),
          getProjectMilestones(pid),
          getChangeRequests(pid)
        ]);
        
        let events: any[] = [];
        
        const uList = Array.isArray(updatesRes) ? updatesRes : [];
        if (uList.length > 0) {
           events.push(...uList.map((u: any) => ({
             type: 'update',
             date: new Date(u.created_at || Date.now()),
             title: 'posted a Site Progress Update',
             desc: u.content || 'Update posted',
             actor: u.author?.display_name || 'Site Member',
             media: u.media_urls
           })));
        }
        
        const mList = Array.isArray(milestonesRes) ? milestonesRes : [];
        if (mList.length > 0) {
           events.push(...mList.map((m: any) => ({
             type: 'milestone',
             date: new Date(m.created_at || Date.now()),
             title: 'created a new Milestone',
             desc: m.title || 'Milestone',
             actor: 'Project Manager',
             media: null
           })));
        }
        
        const cList = Array.isArray(changesRes) ? changesRes : [];
        if (cList.length > 0) {
           events.push(...cList.map((c: any) => ({
             type: 'change',
             date: new Date(c.created_at || Date.now()),
             title: 'drafted a Change Request',
             desc: c.title || 'Change Request',
             actor: c.author?.display_name || 'Engineer',
             media: null
           })));
        }
        
        events.sort((a, b) => b.date.getTime() - a.date.getTime());
        setTimeline(events);
      } catch (err) {
        console.error("Timeline load failed", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params?.id]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'update': return <div className="absolute -left-10.25 top-0 p-1.5 bg-primary/10 rounded-full border-4 border-surface"><CameraIcon className="w-4 h-4 text-primary" /></div>;
      case 'change': return <div className="absolute -left-10.25 top-0 p-1.5 bg-semantic-amber-bg rounded-full border-4 border-surface"><PenToolIcon className="w-4 h-4 text-semantic-amber-on" /></div>;
      case 'milestone': return <div className="absolute -left-10.25 top-0 p-1.5 bg-semantic-emerald-bg rounded-full border-4 border-surface"><MilestoneIcon className="w-4 h-4 text-semantic-emerald-on" /></div>;
      default: return <div className="absolute -left-10.25 top-0 p-1.5 bg-surface-variant rounded-full border-4 border-surface"><CheckCircleIcon className="w-4 h-4 text-on-surface-variant" /></div>;
    }
  }

  // Ensure SSR safety
  const [rolePath, setRolePath] = React.useState('admin');
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setRolePath(window.location.pathname.startsWith('/pm') ? 'pm' : 'admin');
    }
  }, []);

  return (
    <div className="p-6 max-w-300 mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-merriweather text-on-surface">Timeline & Updates</h2>
        <Link href={`/${rolePath}/projects/${params?.id}/update`} className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors">
          <CameraIcon className="w-4 h-4" />
          Post Site Update
        </Link>
      </div>

      <div className="relative pl-8 border-l-2 border-outline-variant/30 space-y-8">
        {loading ? (
          <div className="text-sm text-on-surface-variant animate-pulse">Loading timeline events...</div>
        ) : timeline.length === 0 ? (
          <div className="text-sm text-on-surface-variant">No events recorded yet.</div>
        ) : (
          timeline.map((event, idx) => (
            <div key={idx} className="relative">
              {getIcon(event.type)}
              <TimelineEntry
                timestamp={event.date.toLocaleString()}
                action={event.title}
                description={event.desc}
                actorName={event.actor}
                mediaUrls={event.media || []}
                isLast={idx === timeline.length - 1}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}