"use client";

import React from 'react';
import { X, QrCode, Printer } from 'lucide-react';
import { useToast } from "@/contexts/ToastContext";
import QRCode from "react-qr-code";

export function MaterialQRGenerator({ material, onClose }: any) {
  const toast = useToast();

  const handlePrint = () => {
    window.print();
    toast.success("Sent to printer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:bg-white print:p-0 print:block">
      <div className="bg-surface w-full max-w-sm rounded-xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/30 print:shadow-none print:border-none print:w-full print:max-w-none">
        
        <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface-container-lowest print:hidden">
          <h2 className="text-xl font-bold text-on-surface font-merriweather flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" /> Print Label
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-8 flex flex-col items-center justify-center bg-white text-black text-center print:p-0">
           {/* Real physical QR code bound to database qr_uuid */}
           <div className="mb-6 p-4 bg-white border border-black rounded-lg shadow-sm">
             <QRCode value={material.qr_uuid || 'INVALID_OR_MISSING_UUID'} size={150} level="H" />
           </div>

           <h3 className="font-bold text-lg font-mono uppercase tracking-widest">{material.item_name}</h3>
           <p className="text-sm font-mono mt-1 border-t border-black/20 pt-2 w-full">PO: {material.po_number || 'N/A'}</p>
           <p className="text-sm font-mono">QTY: {material.quantity}</p>
           <p className="text-[10px] text-gray-500 mt-4">Scan upon receipt to update status.</p>
        </div>

        <div className="p-4 bg-surface-variant/30 flex justify-end gap-3 print:hidden">
          <button onClick={onClose} className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-variant rounded">Close</button>
          <button onClick={handlePrint} className="px-4 py-2 text-sm bg-primary text-on-primary font-semibold rounded hover:bg-primary/90 flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print Tag
          </button>
        </div>
      </div>
    </div>
  );
}
