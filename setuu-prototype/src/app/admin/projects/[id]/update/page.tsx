"use client";

import React, { useEffect, useState } from 'react';
import { getUpdates, deleteUpdate, addComment } from '@/app/actions/updateActions';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PlusIcon, VideoIcon, FileTextIcon, LayersIcon, MapPinIcon, MessageSquareIcon, ClockIcon, TrashIcon, XIcon, SparklesIcon, SendIcon, ChevronLeftIcon, Loader2Icon } from 'lucide-react';
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
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

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
        toast.info("New project update posted!");
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);


  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedUpdate) return;
    setIsCommenting(true);
    const res = await addComment(selectedUpdate.id, commentText);
    if (res.success) {
      setCommentText("");
      // refetch or just reload
      window.location.reload();
    } else {
      toast.error(res.error || "Failed to add comment");
    }
    setIsCommenting(false);
  };

  const handleDelete = async (updateId: string) => {
    if (!confirm("Are you sure you want to delete this update?")) return;
    const res = await deleteUpdate(updateId);
    if (res.success) {
      toast.success("Update deleted successfully.");
      setUpdates(prev => prev.filter(u => u.id !== updateId));
    } else {
      toast.error("Failed to delete: " + res.error);
    }
  };

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
          <h2 className="text-2xl font-bold font-merriweather text-on-surface">Project Updates Feed</h2>
          <p className="text-on-surface-variant">Real-time updates, logs, and telemetry.</p>
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
              message="The project feed is empty. Be the first to log a photo or field update."
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
                {/* Delete Button */}
                <div className="absolute top-3 right-3 z-20">
                  <button onClick={() => handleDelete(update.id)} className="w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-semantic-crimson text-white rounded-full backdrop-blur-sm transition-all shadow-lg">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Status and Safety Overlays */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                  {(() => {
                    const hasSafety = update.ai_analysis_flags?.safety_flags && update.ai_analysis_flags.safety_flags.length > 0 && update.ai_analysis_flags.safety_flags[0] !== "Leave empty if none";
                    const hasQuality = update.ai_analysis_flags?.quality_defects && update.ai_analysis_flags.quality_defects.length > 0 && update.ai_analysis_flags.quality_defects[0] !== "Leave empty if none";
                    const hasAiData = !!update.ai_analysis_flags;

                    return (
                      <>
                        {hasSafety && (
                          <div className="bg-semantic-crimson/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm font-bold flex items-center shadow-lg shadow-black/20">
                            ⚠️ Safety Hazard
                          </div>
                        )}
                        {hasQuality && (
                          <div className="bg-semantic-amber/90 backdrop-blur-sm text-black text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm font-bold flex items-center shadow-lg shadow-black/20">
                            🔍 Quality Defect
                          </div>
                        )}
                        {hasAiData && !hasSafety && !hasQuality && (
                          <div className="bg-semantic-emerald/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm font-bold flex items-center shadow-lg shadow-black/20">
                            ✅ General Update
                          </div>
                        )}
                      </>
                    );
                  })()}
                  {update.approval_status === "Pending" && (
                    <div className="bg-surface/90 backdrop-blur-sm text-on-surface text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm font-bold flex items-center shadow-lg shadow-black/20">
                      <ClockIcon className="w-3 h-3 mr-1 text-primary" /> Pending Review
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
                <p className="font-medium text-on-surface text-sm mb-3">
                  {update.caption || update.ai_analysis_flags?.progress_summary || "No caption provided."}
                </p>

                {/* Detailed AI Findings */}
                {update.ai_analysis_flags?.safety_flags && update.ai_analysis_flags.safety_flags.length > 0 && update.ai_analysis_flags.safety_flags[0] !== "Leave empty if none" && (
                  <div className="mb-3 bg-semantic-crimson/10 border border-semantic-crimson/20 p-2 rounded-lg">
                    <p className="text-xs font-bold text-semantic-crimson mb-1 flex items-center gap-1">⚠️ Safety Hazards</p>
                    <ul className="list-disc list-inside text-[11px] text-on-surface-variant">
                      {update.ai_analysis_flags.safety_flags.map((flag: string, idx: number) => (
                        <li key={idx} className="line-clamp-1">{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {update.ai_analysis_flags?.quality_defects && update.ai_analysis_flags.quality_defects.length > 0 && update.ai_analysis_flags.quality_defects[0] !== "Leave empty if none" && (
                  <div className="mb-3 bg-semantic-amber/10 border border-semantic-amber/20 p-2 rounded-lg">
                    <p className="text-xs font-bold text-semantic-amber mb-1 flex items-center gap-1">🔍 Quality Defects</p>
                    <ul className="list-disc list-inside text-[11px] text-on-surface-variant">
                      {update.ai_analysis_flags.quality_defects.map((def: string, idx: number) => (
                        <li key={idx} className="line-clamp-1">{def}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex-1"></div>

                {/* AI Detected Materials */}
                {update.ai_analysis_flags?.materials_visible && update.ai_analysis_flags.materials_visible.length > 0 && update.ai_analysis_flags.materials_visible[0] !== "Leave empty if none" && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {update.ai_analysis_flags.materials_visible.slice(0, 3).map((material: string, idx: number) => (
                      <span key={idx} className="bg-surface-variant text-on-surface-variant text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-outline-variant/50 truncate max-w-[80px]">
                        {material}
                      </span>
                    ))}
                    {update.ai_analysis_flags.materials_visible.length > 3 && (
                      <span className="bg-surface-variant text-on-surface-variant text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-outline-variant/50">
                        +{update.ai_analysis_flags.materials_visible.length - 3}
                      </span>
                    )}
                  </div>
                )}

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

      {/* Modal for Details */}
      {selectedUpdate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedUpdate(null)}>
          <div className="bg-surface w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-elevation-l3 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="relative w-full h-[300px] md:h-[400px] bg-black">
              {selectedUpdate.media_attachments?.[0]?.url && (
                <img src={selectedUpdate.media_attachments[0].url} className="w-full h-full object-contain" alt="Update Details" />
              )}
              <button onClick={() => setSelectedUpdate(null)} className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {selectedUpdate.user_actor?.avatar_url ? (
                    <img src={selectedUpdate.user_actor.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-outline-variant" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                      {selectedUpdate.user_actor?.display_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-on-surface">{selectedUpdate.user_actor?.display_name || "Unknown User"}</p>
                    <p className="text-xs text-on-surface-variant">{new Date(selectedUpdate.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Original Caption</h3>
                <p className="text-on-surface bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">{selectedUpdate.caption || "No caption provided."}</p>
              </div>

              {selectedUpdate.ai_analysis_flags?.progress_summary && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-semantic-indigo uppercase tracking-wider mb-2 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4" /> AI Summary
                  </h3>
                  <p className="text-on-surface bg-semantic-indigo/5 p-4 rounded-xl border border-semantic-indigo/20 leading-relaxed text-sm">
                    {selectedUpdate.ai_analysis_flags.progress_summary}
                  </p>
                </div>
              )}

              {/* Comments Section */}
              <div className="border-t border-outline-variant/30 pt-6">
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MessageSquareIcon className="w-4 h-4" /> Discussion
                </h3>

                <div className="space-y-4 mb-4 max-h-[200px] overflow-y-auto pr-2">
                  {(!selectedUpdate.comments || selectedUpdate.comments.length === 0) ? (
                    <p className="text-sm text-on-surface-variant/70 italic text-center py-4">No comments yet. Be the first to start the discussion!</p>
                  ) : (
                    selectedUpdate.comments.map((comment: any) => (
                      <div key={comment.id} className="flex gap-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/50">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 text-xs">
                          U
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-on-surface">User</span>
                            <span className="text-[10px] text-on-surface-variant">{new Date(comment.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-on-surface">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 p-3 border border-outline-variant rounded-xl bg-surface-container-lowest text-sm text-on-surface focus:border-primary outline-none transition-colors"
                  />
                  <Button variant="primary" type="submit" disabled={isCommenting || !commentText.trim()} className="px-4 rounded-xl">
                    {isCommenting ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <SendIcon className="w-4 h-4" />}
                  </Button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

