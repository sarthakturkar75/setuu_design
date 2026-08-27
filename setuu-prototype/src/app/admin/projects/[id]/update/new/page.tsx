"use client";

import React, { useState, use, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { createUpdate } from "@/app/actions/updateActions";
import { createClient } from "@/lib/supabase/client";
import {
  XIcon, Image as ImageIcon,
  Loader2Icon, CameraIcon, ChevronLeftIcon, UploadIcon
} from "lucide-react";

export default function NewProjectUpdate({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const router = useRouter();
  const toast = useToast();
  const supabase = createClient();

  // Core Data
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [updateType, setUpdateType] = useState("General");

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Camera Logic
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setMediaStream(stream);
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 50);
    } catch (err) {
      toast.error("Camera access denied.");
    }
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !mediaStream) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    
    // Stop tracks
    mediaStream.getTracks().forEach(t => t.stop());
    setIsCameraOpen(false);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
        setFiles(prev => [...prev, file]);
      }
    }, "image/jpeg", 0.9);
  }, [mediaStream]);

  const closeCamera = () => {
    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    setIsCameraOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!caption.trim() && files.length === 0) return toast.error("Please add a description or photo.");
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const formData = new FormData();
      formData.append("project_id", projectId);
      if (user) formData.append("author_id", user.id);
      formData.append("caption", caption.trim());
      formData.append("update_type", updateType);
      files.forEach(f => formData.append("files", f));

      const res = await createUpdate(formData);
      if (res.success) {
        toast.success("Update posted successfully.");
        router.push(`/admin/projects/${projectId}/update`);
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      toast.error(err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCameraOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <video ref={videoRef} autoPlay playsInline className="flex-1 w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute bottom-0 w-full p-8 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent">
          <button onClick={closeCamera} className="text-white bg-white/20 p-4 rounded-full backdrop-blur-md">
            <XIcon className="w-6 h-6" />
          </button>
          <button onClick={capturePhoto} className="w-20 h-20 rounded-full border-4 border-white bg-white/50 backdrop-blur-sm shadow-xl"></button>
          <div className="w-14"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest pb-20">
      {/* Simple Header */}
      <div className="bg-surface border-b border-outline-variant sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-surface-variant rounded-full transition-colors text-on-surface-variant">
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-on-surface">Log Project Update</h1>
          </div>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={isSubmitting || (!caption && files.length === 0)}
            className="px-6 rounded-full shadow-elevation-l1"
          >
            {isSubmitting ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isSubmitting ? "Posting..." : "Post Update"}
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Caption Field */}
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant p-1">
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="What's the latest update?"
            className="w-full min-h-[120px] p-4 bg-transparent resize-none outline-none text-on-surface placeholder:text-on-surface-variant/50"
          />
          
          {/* Media Attachments Strip */}
          {files.length > 0 && (
            <div className="flex gap-3 p-4 overflow-x-auto border-t border-outline-variant/30">
              {files.map((file, idx) => (
                <div key={idx} className="relative shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-outline-variant group">
                  {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-surface-variant/30 text-xs text-on-surface-variant p-2"><ImageIcon className="w-6 h-6 mb-1 opacity-50"/>{file.name}</div>
                  )}
                  <button onClick={() => removeFile(idx)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <XIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center gap-2 p-3 bg-surface-variant/10 rounded-b-xl border-t border-outline-variant/30">
            <input type="file" multiple accept="image/*,video/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 hover:bg-surface-variant text-sm font-medium text-on-surface-variant rounded-full transition-colors">
              <UploadIcon className="w-4 h-4 text-primary" /> Attach Files
            </button>
            <button onClick={openCamera} className="flex items-center gap-2 px-4 py-2 hover:bg-surface-variant text-sm font-medium text-on-surface-variant rounded-full transition-colors">
              <CameraIcon className="w-4 h-4 text-semantic-emerald" /> Take Photo
            </button>
          </div>
        </div>

        {/* Metadata Fields */}
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant p-6 space-y-5">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
            Update Metadata
          </h3>
          
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Update Type</label>
            <select
              value={updateType}
              onChange={e => setUpdateType(e.target.value)}
              className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface-container-lowest text-sm text-on-surface focus:border-primary outline-none"
            >
              <option value="General">General Update</option>
              <option value="Milestone">Milestone Achieved</option>
              <option value="Issue">Issue / Roadblock</option>
              <option value="Note">Field Note</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
