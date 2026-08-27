"use client";

import React, { useEffect, useState } from 'react';
import { getUpdates } from '@/app/actions/updateActions';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PlusIcon, VideoIcon, FileTextIcon, LayersIcon, MapPinIcon, MessageSquareIcon, ClockIcon } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useToast } from '@/contexts/ToastContext';

export default function UpdatesFeedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const toast = useToast();
  const [updates, setUpdates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchUpdates();

    const supabase = createClient();
    const channel = supabase.channel('updates_feed')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'updates',
        filter: `project_id=eq.${id}`
      }, (payload) => {
        // Optimistically reload the feed when a new update arrives
        fetchUpdates();
        toast.info("New site update posted!");
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const fetchUpdates = async () => {
    try {
      const data = await getUpdates({ projectId: id });
      setUpdates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTimelapse = async () => {
    setIsGenerating(true);

    try {
      const res = await fetch('/api/video/timelapse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: id })
      });
      const result = await res.json();
      if (result.success) {

        toast.success("Time-lapse generated!");
        window.open(result.data.video_url, '_blank');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {

      toast.error("Generation failed: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-merriweather text-on-surface">Site Updates Feed</h2>
          <p className="text-on-surface-variant">Real-time photos, telemetry, and progress logs.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleGenerateTimelapse} disabled={isGenerating}>
            <VideoIcon className="w-4 h-4 mr-2 text-semantic-indigo" />
            {isGenerating ? "Compiling..." : "Generate Time-Lapse"}
          </Button>
          <Link href={`/admin/projects/${id}/update/daily-logs`}>
            <Button variant="secondary">
              <FileTextIcon className="w-4 h-4 mr-2 text-primary" /> Daily Logs
            </Button>
          </Link>
          <Link href={`/admin/projects/${id}/update/ar-view`}>
            <Button variant="secondary" className="border-semantic-emerald/30 text-semantic-emerald hover:bg-semantic-emerald/10">
              <LayersIcon className="w-4 h-4 mr-2" /> AR Overlay
            </Button>
          </Link>
          <Link href={`/admin/projects/${id}/update/new`}>
            <Button variant="primary">
              <PlusIcon className="w-4 h-4 mr-2" /> Log Update
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface border border-outline-variant rounded-xl overflow-hidden flex flex-col h-[320px]">
              <LoadingSkeleton className="h-48 w-full rounded-none" />
              <div className="p-4 space-y-3">
                <LoadingSkeleton className="h-5 w-3/4" />
                <LoadingSkeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))
        ) : updates.length === 0 ? (
          <div className="col-span-full flex justify-center py-12">
            <EmptyState
              title="No Updates Yet"
              message="The site feed is empty. Be the first to log a photo or field update."
              icon={<VideoIcon className="w-12 h-12 opacity-20" />}
              action={
                <Link href={`/admin/projects/${id}/update/new`}>
                  <Button variant="primary" className="mt-4">
                    <PlusIcon className="w-4 h-4 mr-2" /> Log First Update
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          updates.map(update => (
            <div key={update.id} className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-elevation-l1 hover:shadow-elevation-l2 transition-all flex flex-col group">
              <div className="aspect-[4/3] bg-surface-container relative overflow-hidden">
                {update.media_attachments?.[0]?.url ? (
                  <img src={update.media_attachments[0].url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Update" />
                ) : (
                  <div className="flex items-center justify-center h-full text-on-surface-variant bg-surface-container-low">No Image Attachment</div>
                )}

                {/* Status and Safety Overlays */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {update.ai_analysis_flags?.missing_ppe && (
                    <div className="bg-semantic-crimson/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm font-bold flex items-center shadow-lg">
                      ⚠️ PPE Violation Detected
                    </div>
                  )}
                  {update.approval_status === "Pending" && (
                    <div className="bg-semantic-amber/90 backdrop-blur-sm text-black text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm font-bold flex items-center shadow-lg">
                      <ClockIcon className="w-3 h-3 mr-1" /> Pending Review
                    </div>
                  )}
                </div>

                {/* Weather Overlay */}
                {update.weather_data && update.weather_data.temperature && (
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-sm font-medium">
                    {Math.round(update.weather_data.temperature)}°C
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <p className="font-medium text-on-surface line-clamp-2 mb-3 flex-1">{update.caption || "No caption provided."}</p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    {update.user_actor?.avatar_url ? (
                      <img src={update.user_actor.avatar_url} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-outline-variant" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                        {update.user_actor?.display_name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-on-surface-variant truncate max-w-[100px]">
                      {update.user_actor?.display_name || "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1" title="Comments">
                      <MessageSquareIcon className="w-3.5 h-3.5" />
                      {update.comments?.length || 0}
                    </span>
                    <span>{new Date(update.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
