"use client";

import React, { useState } from 'react';
import { Camera, Video, UploadCloud, X } from 'lucide-react';

export function DefectMediaUploader({ onChange }: { onChange: (assets: any[]) => void }) {
  const [assets, setAssets] = useState<any[]>([]);

  // Physical file reader converting binary to Base64 for permanent JSON storage
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video' | '360') => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      
      const newAsset = {
        type,
        name: file.name,
        url: base64Data, // Physically storing base64 payload to ensure DB persistence across refreshes
        size: file.size,
        timestamp: new Date().toISOString()
      };
      
      const updated = [...assets, newAsset];
      setAssets(updated);
      onChange(updated);
    };
    
    reader.readAsDataURL(file);
  };

  const removeAsset = (idx: number) => {
    const updated = assets.filter((_, i) => i !== idx);
    setAssets(updated);
    onChange(updated);
  };

  return (
    <div className="border border-dashed border-outline-variant rounded-lg p-4 bg-surface-container-lowest">
      <h4 className="text-xs font-semibold text-on-surface uppercase mb-3 flex items-center gap-2">
        <Camera className="w-4 h-4 text-primary" /> Defect Media Evidence
      </h4>
      
      <div className="flex gap-3 mb-4">
        <label className="flex-1 cursor-pointer flex flex-col items-center justify-center p-3 rounded border border-outline-variant/50 hover:bg-surface-variant transition-colors text-xs text-on-surface-variant">
          <Camera className="w-5 h-5 mb-1 text-on-surface" /> Add Photo
          <input type="file" className="hidden" accept="image/*" onChange={e => handleFile(e, 'photo')} />
        </label>
        <label className="flex-1 cursor-pointer flex flex-col items-center justify-center p-3 rounded border border-outline-variant/50 hover:bg-surface-variant transition-colors text-xs text-on-surface-variant">
          <Video className="w-5 h-5 mb-1 text-on-surface" /> Add Video
          <input type="file" className="hidden" accept="video/*" onChange={e => handleFile(e, 'video')} />
        </label>
        <label className="flex-1 cursor-pointer flex flex-col items-center justify-center p-3 rounded border border-outline-variant/50 hover:bg-surface-variant transition-colors text-xs text-on-surface-variant relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-on-primary text-[8px] font-bold px-1 py-0.5 rounded-bl">360&deg;</div>
          <UploadCloud className="w-5 h-5 mb-1 text-primary" /> Add 360 Scan
          <input type="file" className="hidden" accept=".e57,.xyz,.pts,image/*" onChange={e => handleFile(e, '360')} />
        </label>
      </div>

      {assets.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {assets.map((a, i) => (
            <div key={i} className="relative aspect-square rounded overflow-hidden border border-outline-variant group">
              {a.type === 'video' ? (
                <div className="w-full h-full bg-black flex items-center justify-center"><Video className="w-6 h-6 text-white" /></div>
              ) : (
                <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                 <button type="button" onClick={() => removeAsset(i)} className="p-2 bg-semantic-crimson text-white rounded-full"><X className="w-4 h-4" /></button>
              </div>
              {a.type === '360' && <div className="absolute bottom-1 right-1 bg-primary text-[10px] px-1 font-bold text-white rounded">360&deg;</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
