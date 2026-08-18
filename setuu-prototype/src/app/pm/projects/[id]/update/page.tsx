"use client";
import * as React from "react";
import { CameraIcon, MapPinIcon, RefreshCwIcon, CheckCircleIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { TextArea } from "@/components/ui/TextArea";

export default function CameraUpdatePage() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = React.useState<string | null>(null);
  const [location, setLocation] = React.useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

    // Get Location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }

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
    const locString = location ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}` : "Location Unknown";
    ctx.fillText(`Date: ${timestamp}`, 20, canvas.height - 35);
    ctx.fillText(`GPS: ${locString}`, 20, canvas.height - 15);

    setPhotoDataUrl(canvas.toDataURL("image/jpeg"));
  };

  const retakePhoto = () => {
    setPhotoDataUrl(null);
  };

  return (
    <div className="p-6 max-w-[800px] mx-auto space-y-6 pb-32">
      <div>
         <h2 className="text-2xl font-bold font-merriweather text-on-surface">Live Progress Update</h2>
         <p className="text-on-surface-variant mt-1">Capture a watermarked photo to document site conditions.</p>
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
            
            {/* Camera Overlay UI */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-jetbrains-mono backdrop-blur-md">
               <MapPinIcon className="w-3 h-3" />
               {location ? `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}` : "Locating..."}
            </div>

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
        <form onSubmit={(e) => { e.preventDefault(); alert("Successfully submitted!"); }} className="space-y-6 bg-surface-container border border-outline-variant rounded-xl p-6">
          <div className="flex items-center gap-2 text-semantic-emerald bg-semantic-emerald-bg/10 p-3 rounded-lg border border-semantic-emerald/20">
             <CheckCircleIcon className="w-5 h-5" />
             <span className="font-medium text-sm">Image captured with GPS and timestamp watermark.</span>
          </div>

          <FormField label="Update Description">
            <TextArea 
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
