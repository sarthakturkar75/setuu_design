"use client";

import React, { useEffect, useState } from 'react';
import { getUpdates } from '@/app/actions/updateActions';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PlusIcon, VideoIcon, FileTextIcon, LayersIcon } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function UpdatesFeedPage({ params }: { params: { id: string } }) {
  const toast = useToast();
  const [updates, setUpdates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const data = await getUpdates({ projectId: params.id });
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
        body: JSON.stringify({ projectId: params.id })
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
          <Link href={`/admin/projects/${params.id}/update/daily-logs`}>
            <Button variant="secondary">
              <FileTextIcon className="w-4 h-4 mr-2 text-primary" /> Daily Logs
            </Button>
          </Link>
                    <Link href={`/admin/projects/${params.id}/update/ar-view`}>
            <Button variant="secondary" className="border-semantic-emerald/30 text-semantic-emerald hover:bg-semantic-emerald/10">
              <LayersIcon className="w-4 h-4 mr-2" /> AR Overlay
            </Button>
          </Link>
          <Link href={`/admin/projects/${params.id}/update/new`}>
            <Button variant="primary">
              <PlusIcon className="w-4 h-4 mr-2" /> Log Update
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {isLoading ? (
          <p className="text-on-surface-variant">Loading feed...</p>
        ) : updates.length === 0 ? (
          <p className="text-on-surface-variant col-span-full">No updates found for this project.</p>
        ) : (
          updates.map(update => (
            <div key={update.id} className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="aspect-[4/3] bg-surface-container relative">
                {update.media_attachments?.[0]?.url ? (
                  <img src={update.media_attachments[0].url} className="w-full h-full object-cover" alt="Update" />
                ) : (
                  <div className="flex items-center justify-center h-full text-on-surface-variant">No Image</div>
                )}
                {update.ai_analysis_flags?.missing_ppe && (
                  <div className="absolute top-2 left-2 bg-semantic-crimson text-white text-xs px-2 py-1 rounded font-bold">
                    ⚠️ Safety Violation
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <p className="font-semibold text-on-surface line-clamp-2">{update.caption}</p>
                <div className="flex justify-between items-center text-xs text-on-surface-variant">
                  <span>{new Date(update.created_at).toLocaleDateString()}</span>
                  {update.weather_data && (
                    <span>{update.weather_data.temperature}°C</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
