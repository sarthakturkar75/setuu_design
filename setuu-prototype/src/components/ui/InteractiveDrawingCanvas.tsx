"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Ruler, MousePointer2 } from 'lucide-react';
import { pinEntityToDrawing, updateDrawingScale } from "@/app/actions/drawingActions";
import { useToast } from "@/contexts/ToastContext";

export function InteractiveDrawingCanvas({ drawing }: { drawing: any }) {
  const [mode, setMode] = useState<'view' | 'pin' | 'measure'>('view');
  
  // scaleFactor stores Pixels-per-Foot based on the intrinsic dimensions of the image.
  const [scaleFactor, setScaleFactor] = useState<number>(drawing.custom_data?.scale_factor || 0);
  
  const [tempPoint, setTempPoint] = useState<{x: number, y: number} | null>(null);
  const [mousePos, setMousePos] = useState<{x: number, y: number} | null>(null);
  
  // True measurements array for session
  const [measurements, setMeasurements] = useState<{x1:number, y1:number, x2:number, y2:number, length: string}[]>([]);
  
  const [calibrationModal, setCalibrationModal] = useState<{x1:number, y1:number, x2:number, y2:number} | null>(null);
  const [calibrationInput, setCalibrationInput] = useState('');
  const [calibrationUnit, setCalibrationUnit] = useState('ft');
  
  const imgRef = useRef<HTMLImageElement>(null);
  const toast = useToast();

  useEffect(() => {
    // Reset state when drawing changes
    setScaleFactor(drawing.custom_data?.scale_factor || 0);
    setTempPoint(null);
    setMeasurements([]);
    setMode('view');
  }, [drawing.id]);

  const getPercentageCoords = (e: React.MouseEvent) => {
    if (!imgRef.current) return { x: 0, y: 0 };
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const calculatePixelDistance = (x1_pct: number, y1_pct: number, x2_pct: number, y2_pct: number) => {
    if (!imgRef.current) return 0;
    const nw = imgRef.current.naturalWidth;
    const nh = imgRef.current.naturalHeight;
    const dx = ((x2_pct - x1_pct) / 100) * nw;
    const dy = ((y2_pct - y1_pct) / 100) * nh;
    return Math.sqrt(dx*dx + dy*dy);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode === 'measure' && tempPoint && !calibrationModal) {
      setMousePos(getPercentageCoords(e));
    }
  };

  const handleCanvasClick = async (e: React.MouseEvent) => {
    if (calibrationModal) return; // Block clicks while calibrating
    
    const { x, y } = getPercentageCoords(e);

    if (mode === 'pin') {
      const res = await pinEntityToDrawing(drawing.id, x, y, "issue", null);
      if (res.success) toast.success("Coordinate strictly pinned to drawing!");
      else toast.error(`Pin failed: ${res.error}`);
      setMode('view');
    }

    if (mode === 'measure') {
      if (!tempPoint) {
        setTempPoint({ x, y });
        setMousePos({ x, y });
      } else {
        const x2 = x;
        const y2 = y;
        const pixelDist = calculatePixelDistance(tempPoint.x, tempPoint.y, x2, y2);
        
        if (scaleFactor > 0) {
           // We have a scale! Calculate real physical length
           const physicalDist = pixelDist / scaleFactor;
           const lengthStr = physicalDist.toFixed(2) + " ft";
           setMeasurements([...measurements, { x1: tempPoint.x, y1: tempPoint.y, x2, y2, length: lengthStr }]);
           toast.info(`Linear Takeoff: ${lengthStr}`);
           setTempPoint(null);
           setMousePos(null);
        } else {
           // We need to calibrate!
           setCalibrationModal({ x1: tempPoint.x, y1: tempPoint.y, x2, y2 });
           setTempPoint(null);
           setMousePos(null);
        }
      }
    }
  };

  const handleCalibrateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calibrationModal || !calibrationInput) return;
    
    const physicalValue = parseFloat(calibrationInput);
    if (isNaN(physicalValue) || physicalValue <= 0) return toast.error("Enter a valid number");
    
    // Normalize to feet
    const physicalInFeet = calibrationUnit === 'in' ? physicalValue / 12 : 
                           calibrationUnit === 'm' ? physicalValue * 3.28084 : physicalValue;
                           
    const pixelDist = calculatePixelDistance(calibrationModal.x1, calibrationModal.y1, calibrationModal.x2, calibrationModal.y2);
    const newScaleFactor = pixelDist / physicalInFeet;
    
    setScaleFactor(newScaleFactor);
    setCalibrationModal(null);
    setCalibrationInput('');
    toast.info("Saving physical scale to database...");
    
    const res = await updateDrawingScale(drawing.id, newScaleFactor);
    if (res.success) toast.success(`True scale calibrated to ${newScaleFactor.toFixed(2)} px/ft!`);
    else toast.error("Failed to save scale to DB");
  };

  return (
    <div className="relative w-full h-[600px] bg-surface-variant/20 rounded-xl border border-outline-variant/50 overflow-hidden flex flex-col">
       
       <div className="p-3 bg-surface-container-lowest border-b border-outline-variant/50 flex justify-between items-center z-10 relative shadow-sm">
         <div className="flex items-center gap-4">
           <h3 className="font-bold text-sm text-on-surface">{drawing.drawing_name} (v{drawing.version_number})</h3>
           {scaleFactor > 0 && <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded">Scale Calibrated</span>}
         </div>
         <div className="flex gap-2">
            <button onClick={() => { setMode('view'); setTempPoint(null); }} className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors ${mode === 'view' ? 'bg-primary text-on-primary' : 'bg-surface hover:bg-surface-variant text-on-surface-variant'}`}><Navigation className="w-3.5 h-3.5" /> Pan</button>
            <button onClick={() => { setMode('pin'); setTempPoint(null); }} className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors ${mode === 'pin' ? 'bg-semantic-crimson text-white' : 'bg-surface hover:bg-surface-variant text-on-surface-variant'}`}><MapPin className="w-3.5 h-3.5" /> Drop Pin</button>
            <button onClick={() => { setMode('measure'); setTempPoint(null); }} className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors ${mode === 'measure' ? 'bg-semantic-amber text-black' : 'bg-surface hover:bg-surface-variant text-on-surface-variant'}`}><Ruler className="w-3.5 h-3.5" /> {scaleFactor ? 'Measure Takeoff' : 'Calibrate Scale'}</button>
         </div>
       </div>

       <div 
         className={`relative flex-1 overflow-auto ${mode === 'measure' ? 'cursor-crosshair' : mode === 'pin' ? 'cursor-cell' : 'cursor-grab'}`} 
         onClick={handleCanvasClick}
         onMouseMove={handleMouseMove}
       >
          <img ref={imgRef} src={drawing.file_url} className="w-full h-auto min-w-[800px]" alt="Blueprint" draggable={false} />
          
          {/* SVG Overlay for drawing measurement lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '800px' }}>
            {tempPoint && mousePos && (
               <line 
                 x1={`${tempPoint.x}%`} 
                 y1={`${tempPoint.y}%`} 
                 x2={`${mousePos.x}%`} 
                 y2={`${mousePos.y}%`} 
                 stroke="#f59e0b" // amber-500
                 strokeWidth="2" 
                 strokeDasharray="4 2"
               />
            )}
            
            {measurements.map((m, i) => (
              <g key={i}>
                <line 
                   x1={`${m.x1}%`} 
                   y1={`${m.y1}%`} 
                   x2={`${m.x2}%`} 
                   y2={`${m.y2}%`} 
                   stroke="#f59e0b" 
                   strokeWidth="3" 
                />
                <text 
                  x={`${(m.x1 + m.x2) / 2}%`} 
                  y={`${(m.y1 + m.y2) / 2}%`}
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  dy="-10"
                  style={{ textShadow: "0px 1px 3px rgba(0,0,0,0.8)" }}
                >
                  {m.length}
                </text>
                {/* End caps */}
                <circle cx={`${m.x1}%`} cy={`${m.y1}%`} r="4" fill="#f59e0b" />
                <circle cx={`${m.x2}%`} cy={`${m.y2}%`} r="4" fill="#f59e0b" />
              </g>
            ))}
          </svg>

          {/* Render Physical DB Pins */}
          {drawing.drawing_pins?.map((pin: any) => (
             <div key={pin.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: `${pin.x_coord}%`, top: `${pin.y_coord}%` }}>
                <MapPin className="w-5 h-5 text-semantic-crimson animate-bounce drop-shadow-md" />
             </div>
          ))}

          {/* Render OCR Hyperlinks */}
          {drawing.drawing_hyperlinks?.map((link: any) => (
             <a 
               key={link.id} 
               href={`#sheet-${link.target_drawing_id}`} 
               className="absolute border-2 border-primary/50 bg-primary/20 hover:bg-primary/40 transition-colors flex items-center justify-center cursor-pointer group"
               style={{ 
                 left: `${link.bounding_box_json.x}%`, 
                 top: `${link.bounding_box_json.y}%`, 
                 width: `${link.bounding_box_json.width}%`, 
                 height: `${link.bounding_box_json.height}%` 
               }}
             >
                <span className="opacity-0 group-hover:opacity-100 bg-surface text-on-surface text-[10px] font-bold px-1 rounded shadow-lg absolute -top-6 whitespace-nowrap">
                  {link.bounding_box_json.text}
                </span>
             </a>
          ))}
       </div>
       
       {/* True Calibration Modal */}
       {calibrationModal && (
         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
           <div className="bg-surface p-6 rounded-xl shadow-2xl border border-outline-variant/50 w-80">
              <h3 className="font-bold text-on-surface mb-2 flex items-center gap-2"><Ruler className="w-4 h-4 text-semantic-amber"/> Known Dimension</h3>
              <p className="text-xs text-on-surface-variant mb-4">Enter the physical length of the line you just drew to calibrate the engine's pixels-per-foot ratio.</p>
              
              <form onSubmit={handleCalibrateSubmit} className="flex flex-col gap-4">
                 <div className="flex gap-2">
                    <input 
                      type="number" 
                      step="0.01" 
                      required
                      autoFocus
                      placeholder="e.g. 3.0"
                      value={calibrationInput}
                      onChange={e => setCalibrationInput(e.target.value)}
                      className="flex-1 p-2 rounded bg-surface-container-lowest border border-outline-variant text-sm focus:border-primary focus:outline-none"
                    />
                    <select 
                      value={calibrationUnit} 
                      onChange={e => setCalibrationUnit(e.target.value)}
                      className="w-20 p-2 rounded bg-surface-container-lowest border border-outline-variant text-sm focus:border-primary focus:outline-none"
                    >
                       <option value="ft">Feet</option>
                       <option value="in">Inches</option>
                       <option value="m">Meters</option>
                    </select>
                 </div>
                 <div className="flex gap-2 mt-2">
                    <button type="button" onClick={() => setCalibrationModal(null)} className="flex-1 py-2 font-bold text-xs text-on-surface-variant hover:bg-surface-variant rounded transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 py-2 font-bold text-xs bg-semantic-amber text-black hover:bg-semantic-amber/90 rounded transition-colors">Set Scale</button>
                 </div>
              </form>
           </div>
         </div>
       )}
    </div>
  );
}
