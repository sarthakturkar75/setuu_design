"use client";

import { useState, useEffect } from "react";
import { CameraIcon, UploadCloudIcon, MapPinIcon, XIcon, CheckIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export default function CameraUpdatePage({ params }: { params: { id: string } }) {
  const [currentTime, setCurrentTime] = useState("");
  const [location, setLocation] = useState("Acquiring GPS...");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    // Simulated live timestamp update
    const interval = setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, 1000);
    
    // Simulated GPS acquisition
    setTimeout(() => {
      setLocation("37.7749° N, 122.4194° W");
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-black relative overflow-hidden flex flex-col">
      {/* Viewfinder Mock */}
      <div className="flex-1 relative">
        <img 
          src="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop" 
          alt="Camera Viewfinder" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        
        {/* Viewfinder Reticle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-white/30 rounded-lg relative">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-white"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-white"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-white"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-white"></div>
          </div>
        </div>

        {/* Cryptographic Watermark Overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/20 text-white font-jetbrains-mono text-xs z-10">
          <div className="flex items-center gap-2 mb-1">
            <MapPinIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-bold">VERIFIED LOCATION</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="opacity-60 text-[10px]">COORDINATES</p>
              <p>{location}</p>
            </div>
            <div>
              <p className="opacity-60 text-[10px]">TIMESTAMP (UTC)</p>
              <p>{currentTime || "Syncing..."}</p>
            </div>
            <div className="col-span-2">
              <p className="opacity-60 text-[10px]">SYSTEM HASH</p>
              <p className="truncate">0x4a8b...{params.id}...9f2e</p>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Controls Area */}
      <div className="h-32 bg-black pb-safe shrink-0 flex items-center justify-between px-8 border-t border-white/10">
        <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur">
          <XIcon className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center focus:scale-95 transition-transform"
        >
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
            <CameraIcon className="w-8 h-8 text-black" />
          </div>
        </button>
        
        <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur">
          <UploadCloudIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Upload Bottom Sheet Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Progress Update">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Link to Milestone</label>
            <select className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary">
              <option>Phase 1: Foundation Pour</option>
              <option>Phase 2: Framing</option>
              <option>General Site Update</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Dictate Caption</label>
            <textarea 
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary min-h-[100px]"
              placeholder="Describe the update... (Voice typing supported)"
            ></textarea>
          </div>

          <button 
            onClick={() => setIsModalOpen(false)}
            className="w-full py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <CheckIcon className="w-5 h-5" />
            Commit Update
          </button>
        </div>
      </Modal>
    </div>
  );
}
