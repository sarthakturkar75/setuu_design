"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { TextArea } from '@/components/ui/TextArea';
import { MapPinIcon, CheckCircleIcon, RefreshCwIcon, EditIcon, PenIcon, TypeIcon, SquareIcon } from 'lucide-react';
import { createUpdate } from "@/app/actions/updateActions";
import localforage from "localforage";
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';

// Using a dynamic import or checking typeof window for fabric can help with SSR issues
// We'll import fabric lazily when markup starts
import * as fabric from "fabric";

export default function UpdateCameraPage({ params }: { params: { id: string } }) {
  const toast = useToast();
  const { id } = params;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [caption, setCaption] = useState("");
  const supabase = createClient();

  // Markup state
  const [isMarkupMode, setIsMarkupMode] = useState(false);
  const [fabricCanvas, setFabricCanvas] = useState<any>(null); // Use any for loose fabric v6 typing

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });

        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true`)
          .then(res => res.json())
          .then(data => {
            if (data.current_weather) {
              setWeather({
                temperature: data.current_weather.temperature,
                windspeed: data.current_weather.windspeed,
                weathercode: data.current_weather.weathercode
              });
            }
          })
          .catch(err => console.error("Weather fetch error:", err));
      });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

    ctx.fillStyle = "white";
    ctx.font = "16px 'JetBrains Mono', monospace";
    const timestamp = new Date().toLocaleString();
    const locString = location ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}` : "Location Unknown";
    const weatherString = weather ? `Temp: ${weather.temperature}°C, Wind: ${weather.windspeed}km/h` : "Weather Unknown";
    ctx.fillText(`Date: ${timestamp} | ${weatherString}`, 20, canvas.height - 35);
    ctx.fillText(`GPS: ${locString}`, 20, canvas.height - 15);

    setPhotoDataUrl(canvas.toDataURL("image/jpeg"));
  };

  const retakePhoto = () => {
    setPhotoDataUrl(null);
    setIsMarkupMode(false);
    if (fabricCanvas) {
      fabricCanvas.dispose();
      setFabricCanvas(null);
    }
  };

  const startMarkup = () => {
    if (!canvasRef.current || !photoDataUrl) return;
    setIsMarkupMode(true);

    const fCanvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true
    });
    fCanvas.freeDrawingBrush = new fabric.PencilBrush(fCanvas);
    fCanvas.freeDrawingBrush.color = 'red';
    fCanvas.freeDrawingBrush.width = 5;

    fabric.FabricImage.fromURL(photoDataUrl).then((img: any) => {
      fCanvas.backgroundImage = img;
      if (img.width && img.height) {
        const scale = Math.min((canvasRef.current?.parentElement?.clientWidth || 800) / img.width, 1);
        fCanvas.setDimensions({ width: img.width * scale, height: img.height * scale });
        img.scale(scale);
      }
      fCanvas.renderAll();
    }).catch((e: any) => console.log('Fabric load error (handled by standard image):', e));

    setFabricCanvas(fCanvas);
  };

  const addText = () => {
    if (!fabricCanvas) return;
    fabricCanvas.isDrawingMode = false;
    const text = new fabric.IText('Annotate here', {
      left: 50,
      top: 50,
      fill: 'yellow',
      fontSize: 30,
      fontFamily: 'Arial',
      backgroundColor: 'rgba(0,0,0,0.5)'
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
  };

  const addRect = () => {
    if (!fabricCanvas) return;
    fabricCanvas.isDrawingMode = false;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'transparent',
      stroke: 'blue',
      strokeWidth: 4,
      width: 100,
      height: 100
    });
    fabricCanvas.add(rect);
    fabricCanvas.renderAll();
  };

  const enableDrawing = () => {
    if (!fabricCanvas) return;
    fabricCanvas.isDrawingMode = true;
  };

  if (isSubmitted) {
    return (
      <div className="p-6 max-w-[800px] mx-auto space-y-8 pt-24 text-center">
        <CheckCircleIcon className="w-16 h-16 text-semantic-emerald mx-auto mb-4" />
        <h2 className="text-2xl font-bold font-merriweather text-on-surface">Update Saved</h2>
        <p className="text-on-surface-variant max-w-md mx-auto">Your watermarked photo has been securely logged to the timeline.</p>
        <div className="pt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={() => { setIsSubmitted(false); setPhotoDataUrl(null); setCaption(""); }}>Log Another Update</Button>
          <Link href={`/admin/projects/${id}/update`}>
            <Button variant="primary">Return to Feed</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[800px] mx-auto space-y-6 pb-32">
      <div>
        <h2 className="text-2xl font-bold font-merriweather text-on-surface flex items-center gap-2">Live Progress Capture</h2>
        <p className="text-on-surface-variant mt-1">Capture a watermarked photo to document site conditions.</p>
      </div>

      <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {!photoDataUrl ? (
          <div className="relative bg-black aspect-[4/3] flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-jetbrains-mono backdrop-blur-md">
              <MapPinIcon className="w-3 h-3" />
              {location ? `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}` : "Locating..."}
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <button onClick={capturePhoto} className="w-16 h-16 bg-white rounded-full border-4 border-outline-variant/50 hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-black rounded-full" />
              </button>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center bg-black min-h-[400px]">
            {isMarkupMode && (
              <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 bg-black/60 p-2 rounded-lg backdrop-blur-sm border border-white/20">
                <button type="button" onClick={enableDrawing} className="p-2 bg-surface text-on-surface rounded hover:bg-surface-variant" title="Draw"><PenIcon className="w-4 h-4 text-semantic-crimson" /></button>
                <button type="button" onClick={addText} className="p-2 bg-surface text-on-surface rounded hover:bg-surface-variant" title="Add Text"><TypeIcon className="w-4 h-4 text-semantic-amber" /></button>
                <button type="button" onClick={addRect} className="p-2 bg-surface text-on-surface rounded hover:bg-surface-variant" title="Add Box"><SquareIcon className="w-4 h-4 text-semantic-indigo" /></button>
              </div>
            )}

            <div className={`relative ${!isMarkupMode ? "w-full h-full" : ""}`}>
              {!isMarkupMode && <img src={photoDataUrl} alt="Captured" className="w-full h-full object-contain" />}
              <canvas ref={canvasRef} className={!isMarkupMode ? "hidden" : "block"} />
            </div>

            <div className="absolute top-4 right-4 flex gap-2 z-20">
              {!isMarkupMode && (
                <Button variant="primary" size="sm" onClick={startMarkup} className="gap-2 shadow-lg">
                  <EditIcon className="w-4 h-4" /> Markup
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={retakePhoto} className="gap-2 bg-black/50 text-white border-0 hover:bg-black/70 shadow-lg">
                <RefreshCwIcon className="w-4 h-4" /> Retake
              </Button>
            </div>
          </div>
        )}
      </div>

      {photoDataUrl && (
        <form action={async (formData) => {
          setIsSubmitting(true);
          try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) throw new Error("User not authenticated");

            formData.append('project_id', id);
            formData.append('author_id', user.id);
            if (location) {
              formData.append('latitude', location.lat.toString());
              formData.append('longitude', location.lng.toString());
            }
            if (weather) {
              formData.append('weather_data', JSON.stringify(weather));
            }

            const idempotencyKey = `update-${Date.now()}`;
            formData.append('idempotency_key', idempotencyKey);

            const finalDataUrl = fabricCanvas ? fabricCanvas.toDataURL({ format: 'jpeg', quality: 0.8 }) : photoDataUrl;

            if (!navigator.onLine) {
              await localforage.setItem(idempotencyKey, {
                projectId: id,
                authorId: user.id,
                caption: formData.get('caption'),
                latitude: location?.lat,
                longitude: location?.lng,
                weatherData: weather,
                photoDataUrl: finalDataUrl,
                idempotencyKey
              });

              if ('serviceWorker' in navigator && 'SyncManager' in window) {
                const reg = await navigator.serviceWorker.ready;
                try {
                  await (reg as any).sync.register('sync-updates');
                } catch (e) { }
              }

              toast.success("Saved offline. Will sync when connected.");
              setIsSubmitted(true);
              setIsSubmitting(false);
              return;
            }

            const response = await fetch(finalDataUrl);
            const blob = await response.blob();
            const file = new File([blob], `update-${Date.now()}.jpg`, { type: blob.type });

            formData.append('files', file);

            const res = await createUpdate(formData);
            if (res.success) {
              if (res.safetyViolation) {
                toast.error("⚠️ Safety Violation Detected and Logged");
              }
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
          <FormField label="Update Description">
            <TextArea
              name="caption"
              placeholder="Describe what was completed or what the photo demonstrates..."
              rows={4}
            />
          </FormField>
          <div className="flex justify-end gap-3">
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
