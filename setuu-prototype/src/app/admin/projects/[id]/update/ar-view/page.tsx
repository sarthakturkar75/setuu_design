"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { LayersIcon, TargetIcon } from 'lucide-react';
import Link from 'next/link';

export default function ARViewPage({ params }: { params: { id: string } }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [baseHeading, setBaseHeading] = useState(0);

  useEffect(() => {
    // Start Camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("Camera access denied", err));
    }

    // Device Orientation for basic AR anchoring
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha || 0, // Z-axis rotation (compass)
        beta: event.beta || 0,   // X-axis (tilt front/back)
        gamma: event.gamma || 0  // Y-axis (tilt left/right)
      });
    };

    // Need permission for iOS 13+
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // User must interact first to request permission, we handle this in calibrate
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleCalibrate = async () => {
    // iOS permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', (e) => {
            setOrientation({ alpha: e.alpha || 0, beta: e.beta || 0, gamma: e.gamma || 0 });
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    setBaseHeading(orientation.alpha);
    setIsCalibrated(true);
  };

  // Calculate relative rotation from the calibration point
  const relativeAlpha = (orientation.alpha - baseHeading + 360) % 360;
  
  // Transform style for the blueprint overlay
  const overlayTransform = `
    perspective(1000px) 
    rotateX(${orientation.beta - 90}deg) 
    rotateY(${orientation.gamma}deg) 
    rotateZ(${-relativeAlpha}deg)
  `;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full p-4 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent text-white">
        <div>
          <h2 className="font-bold font-merriweather flex items-center gap-2">
            <LayersIcon className="w-5 h-5 text-semantic-indigo" /> AR Blueprint
          </h2>
          <p className="text-xs text-white/70">Align the camera to grid line A-1 and calibrate.</p>
        </div>
        <Link href={`/admin/projects/${params.id}/update`}>
          <Button variant="ghost" className="text-white hover:bg-white/20">Close</Button>
        </Link>
      </div>

      {/* Camera Feed */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Blueprint Overlay */}
      {isCalibrated && (
        <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center pointer-events-none">
          <div 
            className="w-[800px] h-[800px] border-4 border-semantic-emerald/50 bg-semantic-emerald/10 opacity-70 transition-transform duration-75 ease-out"
            style={{ transform: overlayTransform }}
          >
            {/* Simulated blueprint lines */}
            <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.4) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-semantic-emerald font-bold text-4xl">
              HVAC ZONE A
            </div>
          </div>
        </div>
      )}

      {/* UI Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
        {!isCalibrated ? (
          <Button variant="primary" onClick={handleCalibrate} className="rounded-full shadow-lg h-14 px-8 text-lg font-bold animate-pulse">
            <TargetIcon className="w-5 h-5 mr-2" /> Calibrate Anchor
          </Button>
        ) : (
          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-jetbrains-mono border border-white/10">
            A: {orientation.alpha.toFixed(1)}° | B: {orientation.beta.toFixed(1)}° | G: {orientation.gamma.toFixed(1)}°
          </div>
        )}
      </div>
      
      {/* Reticle */}
      {!isCalibrated && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
           <TargetIcon className="w-12 h-12 text-white/50" />
         </div>
      )}
    </div>
  );
}
