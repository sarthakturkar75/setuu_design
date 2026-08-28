"use client";
import { useToast } from "@/contexts/ToastContext";
import * as React from "react";
import { CameraIcon, MapPinIcon, RefreshCwIcon, CheckCircleIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { TextArea } from "@/components/ui/TextArea";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createUpdate } from "@/app/actions/updateActions";
import { createClient } from "@/lib/supabase/client";

export default function CameraUpdatePage() {
  const toast = useToast();

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = React.useState<string | null>(null);
  const [location, setLocation] = React.useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [caption, setCaption] = React.useState("");

  const params = useParams();
  const id = params?.id as string;
  const supabase = createClient();

  React.useEffect(() => {
    // Start camera
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }

    startCamera();


    return () => {
      // Cleanup stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw watermark
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
    
    ctx.fillStyle = "white";
    ctx.font = "16px 'JetBrains Mono', monospace";
    const timestamp = new Date().toLocaleString();
    
    ctx.fillText(`Date: ${timestamp}`, 20, canvas.height - 35);
    

    setPhotoDataUrl(canvas.toDataURL("image/jpeg"));
  };

  const retakePhoto = () => {
    setPhotoDataUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();

        // Find an active milestone to link this to
        let { data: milestones } = await supabase
          .from('milestones')
          .select('id')
          .eq('project_id', id)
          .limit(1);

        const milestoneId = milestones?.[0]?.id || null;
        
        // Save the update record
        const { data: newUpdate, error } = await supabase.from('updates').insert({
          project_id: id,
          milestone_id: milestoneId,
          author_id: user?.id,
          caption: caption || "Photo update",
          is_watermarked: true,
          approval_status: "Pending"
        }).select().single();

        if (error) throw error;

        // In a full app, we would upload photoDataUrl to Supabase Storage, 
        // then insert a row into `media_attachments` linked to newUpdate.id

        setIsSubmitted(true);
      } catch (error) {
        console.error("Failed to post update:", error);
        toast.error("Failed to submit update. Check console for details.");
      } finally {
        setIsSubmitting(false);
      }
  };

  if (isSubmitted) {
      return (
        <div className="p-6 max-w-[800px] mx-auto space-y-8 pt-24 text-center">
            <CheckCircleIcon className="w-16 h-16 text-semantic-emerald mx-auto mb-4" />
            <h2 className="text-2xl font-bold font-merriweather text-on-surface">Update Saved</h2>
            <p className="text-on-surface-variant max-w-md mx-auto">Your watermarked photo and description have been securely logged to the timeline.</p>
            <div className="pt-8 flex justify-center gap-4">
                <Button variant="outline" onClick={() => { setIsSubmitted(false); setPhotoDataUrl(null); setCaption(""); }}>Log Another Update</Button>
                <Link href={`/pm/projects/${id}`}>
                    <Button variant="primary" onClick={() => window.location.href = ("/pm")}>Return to Dashboard</Button>
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="p-6 max-w-[800px] mx-auto space-y-6 pb-32">
      <div>
         <h2 className="text-2xl font-bold font-merriweather text-on-surface">Live Progress Update</h2>
         <p className="text-on-surface-variant mt-1">Capture a watermarked photo to document project conditions.</p>
      </div>

      <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {!photoDataUrl ? (
          <div className="relative bg-black aspect-[4/3] flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            


            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <button 
                onClick={capturePhoto}
                className="w-16 h-16 bg-white rounded-full border-4 border-outline-variant/50 hover:scale-105 transition-transform flex items-center justify-center"
              >
                <div className="w-12 h-12 border-2 border-black rounded-full" />
              </button>
            </div>
          </div>
        ) : (
          <div className="relative aspect-[4/3]">
            <img src={photoDataUrl} alt="Captured" className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4">
              <Button variant="secondary" size="sm" onClick={retakePhoto} className="gap-2 bg-black/50 text-white border-0 hover:bg-black/70">
                <RefreshCwIcon className="w-4 h-4" /> Retake
              </Button>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {photoDataUrl && (
        <form action={async (formData) => {
            setIsSubmitting(true);
            try {
              // 1. Get the actual user ID from the Supabase auth context
              const { data: { user }, error: authError } = await supabase.auth.getUser();
              if (authError || !user) throw new Error("User not authenticated");
              
              formData.append('project_id', id);
              formData.append('author_id', user.id);
              
              // 2. Convert base64 data URL to an actual Blob/File
              const response = await fetch(photoDataUrl);
              const blob = await response.blob();
              const file = new File([blob], `update-${Date.now()}.jpg`, { type: blob.type });
              
              // 3. Append the actual file
              formData.append('files', file);
              
              const res = await createUpdate(formData);
              if (res.success) {
                setIsSubmitted(true);
              } else {
                toast.error("Error: " + res.error);
              }
            } catch (error: any) {
              toast.error("Error: " + error.message);
            } finally {
              setIsSubmitting(false);
            }
        }} className="space-y-6 bg-surface-container border border-outline-variant rounded-xl p-6">
          <div className="flex items-center gap-2 text-semantic-emerald bg-semantic-emerald-bg/10 p-3 rounded-lg border border-semantic-emerald/20">
             <CheckCircleIcon className="w-5 h-5" />
             <span className="font-medium text-sm">Image captured with timestamp watermark.</span>
          </div>

          <FormField label="Update Description">
            <TextArea 
              name="caption"
              placeholder="Describe what was completed or what the photo demonstrates..."
              rows={4}
            />
          </FormField>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={retakePhoto}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Save Progress Update"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
