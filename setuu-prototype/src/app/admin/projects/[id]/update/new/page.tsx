"use client";

import React, { useState, useEffect, use, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { createUpdate } from "@/app/actions/updateActions";
import { createClient } from "@/lib/supabase/client";
import {
  MapPinIcon, SparklesIcon, XIcon, Image as ImageIcon,
  Link2Icon, Loader2Icon, CompassIcon, CameraIcon,
  Settings2Icon, MapIcon, ChevronLeftIcon
} from "lucide-react";

export default function FieldUpdateLogger({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const router = useRouter();
  const toast = useToast();

  // We instantiate supabase but do NOT put it in the useEffect dependency array to prevent infinite loops.
  const supabase = createClient();

  // Core Data State
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [milestoneId, setMilestoneId] = useState("");
  const [locationName, setLocationName] = useState("");
  const [weatherOverride, setWeatherOverride] = useState("");

  // Telemetry State
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"locating" | "locked" | "denied" | "idle">("idle");

  // UI State
  const [milestones, setMilestones] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // True In-Browser Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const galleryInputRef = useRef<HTMLInputElement>(null);

  // FIXED: Removed 'supabase' from dependency array to stop infinite toast spam
  useEffect(() => {
    const initContext = async () => {
      const { data } = await supabase.from("milestones").select("id, title").eq("project_id", projectId);
      if (data) setMilestones(data);
    };
    initContext();
    captureLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // Robust Native GPS Handling
  const captureLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus("denied");
      return;
    }

    setGpsStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setGpsStatus("locked");
      },
      (error) => {
        console.warn("GPS Access Denied or Failed:", error.message);
        setGpsStatus("denied");
        toast.warning("GPS blocked. You can enter the location manually.");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // ==========================================
  // TRUE IN-BROWSER CAMERA LOGIC
  // ==========================================
  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" } // Prioritizes rear camera on mobile
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error("Camera access denied or unavailable on this device.");
      setIsCameraOpen(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });
            setFiles(prev => [...prev, file]);
          }
        }, 'image/jpeg', 0.8);
      }
      closeCamera();
    }
  };

  const closeCamera = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setMediaStream(null);
  }, [mediaStream]);

  // Cleanup camera if user navigates away
  useEffect(() => {
    return () => { if (isCameraOpen) closeCamera(); };
  }, [isCameraOpen, closeCamera]);

  // ==========================================

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!caption.trim() && files.length === 0) {
      toast.error("An update requires either a photo or a progress note.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("project_id", projectId);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) formData.append("author_id", user.id);

    formData.append("caption", caption.trim());
    if (milestoneId) formData.append("milestone_id", milestoneId);

    if (gpsStatus === "locked" && latitude && longitude) {
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
    }

    if (locationName.trim()) formData.append("location_name", locationName.trim());

    if (weatherOverride.trim()) {
      try {
        JSON.parse(weatherOverride);
        formData.append("weather_data", weatherOverride.trim());
      } catch {
        console.warn("Invalid weather JSON skipped.");
      }
    }

    files.forEach(file => formData.append("files", file));

    try {
      toast.info("Syncing update to Setuu Cloud...");
      const res = await createUpdate(formData);

      if (res.success) {
        if (res.safetyViolation) {
          toast.warning("Logged! The AI Vision model flagged a safety issue for review.");
        } else {
          toast.success("Progress logged successfully!");
        }
        router.push(`/admin/projects/${projectId}/update`);
      } else {
        toast.error(res.error || "Failed to log update.");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      toast.error("A critical error occurred while syncing.");
    } finally {
      // THE FIX: This guarantees the overlay closes immediately!
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest min-h-[calc(100vh-64px)] relative pb-24">

      {/* FULL SCREEN CAMERA OVERLAY */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-in fade-in">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />

          <div className="absolute top-6 left-6">
            <button onClick={closeCamera} className="bg-white/20 p-3 rounded-full backdrop-blur text-white hover:bg-white/40">
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute bottom-12 left-0 right-0 flex justify-center">
            <button onClick={takePhoto} className="w-20 h-20 bg-white/50 backdrop-blur rounded-full p-2 flex items-center justify-center border-4 border-white hover:bg-white transition-colors cursor-pointer shadow-xl">
              <div className="w-full h-full bg-white rounded-full"></div>
            </button>
          </div>
        </div>
      )}

      {/* CLEAN NATIVE APP HEADER */}
      <div className="bg-surface border-b border-outline-variant px-4 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-surface-variant/50 text-on-surface transition-colors">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold font-merriweather text-on-surface leading-tight">Field Update</h1>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-semantic-indigo bg-semantic-indigo/10 px-2 py-0.5 rounded w-fit mt-0.5">
              <SparklesIcon className="w-3 h-3" /> AI Analysis Active
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
        >
          <Settings2Icon className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">

        {/* PRIMARY JOURNAL CARD */}
        <div className="bg-surface border border-outline-variant rounded-2xl shadow-elevation-l1 overflow-hidden transition-all focus-within:border-primary/50 focus-within:shadow-elevation-l2">
          <textarea
            autoFocus
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's the status on site today?"
            className="w-full min-h-[160px] p-5 bg-transparent resize-none text-on-surface focus:outline-none placeholder:text-on-surface-variant/50 text-lg leading-relaxed"
          />

          {/* DYNAMIC MEDIA TRAY */}
          {files.length > 0 && (
            <div className="px-5 pb-4 flex gap-3 overflow-x-auto snap-x scrollbar-hide">
              {files.map((file, idx) => (
                <div key={idx} className="relative group shrink-0 w-28 h-28 bg-surface-container rounded-xl border border-outline-variant overflow-hidden snap-start shadow-sm">
                  {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-xs font-mono text-on-surface-variant p-2 text-center bg-surface-variant/20">
                      <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center mb-1 shadow-sm"><ImageIcon className="w-4 h-4" /></div>
                      <span className="truncate w-full">{file.name}</span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(idx)}
                    className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-semantic-crimson backdrop-blur-sm"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* HARDWARE ACTION TOOLBAR */}
          <div className="p-3 border-t border-outline-variant/30 bg-surface-variant/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* TRUE WEB RTC CAMERA BUTTON */}
              <Button variant="secondary" onClick={openCamera} className="rounded-full shadow-none bg-surface border border-outline-variant hover:border-primary/50 text-on-surface">
                <CameraIcon className="w-4 h-4 md:mr-2 text-primary" />
                <span className="hidden md:inline">Take Photo</span>
              </Button>

              {/* GALLERY/FILES TRIGGER */}
              <input type="file" multiple accept="image/*, video/*, application/pdf" className="hidden" ref={galleryInputRef} onChange={handleFileSelect} />
              <Button variant="secondary" onClick={() => galleryInputRef.current?.click()} className="rounded-full shadow-none bg-surface border border-outline-variant hover:border-primary/50 text-on-surface px-3">
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* GPS TELEMETRY BADGE */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-colors cursor-pointer
                                ${gpsStatus === 'locating' ? 'border-primary/30 bg-primary/5 text-primary' :
                  gpsStatus === 'locked' ? 'border-semantic-emerald/30 bg-semantic-emerald/5 text-semantic-emerald' :
                    'border-semantic-amber/30 bg-semantic-amber/5 text-semantic-amber'}`}
              onClick={captureLocation}
              title="Tap to refresh GPS"
            >
              {gpsStatus === 'locating' ? <Loader2Icon className="w-3.5 h-3.5 animate-spin" /> :
                gpsStatus === 'locked' ? <CompassIcon className="w-3.5 h-3.5" /> :
                  <MapIcon className="w-3.5 h-3.5" />}
              {gpsStatus === 'locating' ? 'Locating...' :
                gpsStatus === 'locked' ? 'GPS Active' : 'No GPS'}
            </div>
          </div>
        </div>

        {/* ADVANCED SETTINGS CARD (Expandable) */}
        {showSettings && (
          <div className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-elevation-l1 animate-in slide-in-from-top-4 fade-in duration-200">
            <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider mb-4 flex items-center gap-2">
              <Settings2Icon className="w-4 h-4 text-primary" /> Update Metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Map to Schedule Phase</label>
                <div className="relative">
                  <Link2Icon className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant/50" />
                  <select
                    value={milestoneId}
                    onChange={(e) => setMilestoneId(e.target.value)}
                    className="w-full pl-9 p-2.5 border border-outline-variant rounded-lg bg-surface-container-lowest text-sm text-on-surface appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="">General Project Update</option>
                    {milestones.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Area / Location Label</label>
                <div className="relative">
                  <MapPinIcon className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant/50" />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full pl-9 p-2.5 border border-outline-variant rounded-lg bg-surface-container-lowest text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="e.g., Boiler Room Level 2"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Weather JSON Override (Advanced)</label>
                <textarea
                  value={weatherOverride}
                  onChange={(e) => setWeatherOverride(e.target.value)}
                  className="w-full min-h-[80px] p-3 border border-outline-variant rounded-lg bg-surface-container-lowest font-mono text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y"
                  placeholder='{"temperature": 25, "conditions": "Sunny"}'
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STICKY FLOATING ACTION BAR FOR MOBILE-FRIENDLY SUBMISSION */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/80 backdrop-blur-xl border-t border-outline-variant shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-end items-center z-30 px-4 md:px-6">
        <div className="max-w-3xl w-full mx-auto flex justify-between items-center gap-4">
          <span className="text-xs text-on-surface-variant hidden md:block">
            Ready to sync? Media will be processed by AI.
          </span>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting || (!caption && files.length === 0)}
            className="w-full md:w-auto shadow-elevation-l2 text-base font-bold py-6 px-12 rounded-xl"
          >
            {isSubmitting ? <Loader2Icon className="w-5 h-5 mr-2 animate-spin" /> : null}
            {isSubmitting ? "Syncing..." : "Submit Update"}
          </Button>
        </div>
      </div>

      {/* Submitting Full Screen Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-surface/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-surface p-6 rounded-2xl shadow-elevation-l3 flex flex-col items-center gap-4 border border-outline-variant animate-in zoom-in">
            <Loader2Icon className="w-10 h-10 text-primary animate-spin" />
            <h3 className="font-bold text-on-surface">Uploading to Setuu</h3>
            <p className="text-sm text-on-surface-variant text-center max-w-[200px]">Running safety protocols and securely storing media...</p>
          </div>
        </div>
      )}
    </div>
  );
}