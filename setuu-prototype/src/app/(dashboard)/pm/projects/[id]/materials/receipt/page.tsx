"use client";

import { CheckCircle2Icon, AlertCircleIcon, PackageIcon } from "lucide-react";

export default function MaterialReceiptPage({ params }: { params: { id: string } }) {
  
  // Dummy data for visual scaffolding
  const materialData = {
    po_number: "PO-20994-XY",
    spec_id: "SPEC-HVAC-90",
    material_name: "Industrial HVAC Unit 5000",
    vendor_name: "Acme Corp Logistics",
    expected_date: "2024-05-12",
  };

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto w-full pb-24">
      
      <div className="mb-8 text-center pt-4">
        <div className="w-16 h-16 bg-surface-container rounded-full mx-auto flex items-center justify-center mb-4">
          <PackageIcon className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold font-inter text-on-surface tracking-tight">Material Receipt</h1>
        <p className="text-sm text-on-surface-variant font-inter mt-1">Verify field delivery against PO manifest.</p>
      </div>

      <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm mb-8">
        <div className="bg-surface-container/50 px-5 py-3 border-b border-outline-variant/50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Manifest Details</h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs text-on-surface-variant mb-1">PO Number</p>
            <p className="font-jetbrains-mono font-bold text-lg text-primary">{materialData.po_number}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant mb-1">Spec ID</p>
            <p className="font-jetbrains-mono text-sm bg-surface-container px-2 py-1 rounded inline-block">{materialData.spec_id}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant mb-1">Component Description</p>
            <p className="text-on-surface font-medium">{materialData.material_name}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant mb-1">Logistics / Vendor</p>
            <p className="text-on-surface">{materialData.vendor_name}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button className="w-full min-h-[64px] bg-semantic-emerald text-white rounded-xl font-bold uppercase tracking-wide flex items-center justify-center gap-3 hover:bg-semantic-emerald-bg/90 transition-all shadow-lg active:scale-[0.98]">
          <CheckCircle2Icon className="w-6 h-6" />
          Verify Delivery (Match)
        </button>
        
        <button className="w-full min-h-[64px] bg-surface-container border border-outline-variant text-semantic-crimson rounded-xl font-bold uppercase tracking-wide flex items-center justify-center gap-3 hover:bg-semantic-crimson/10 transition-all active:scale-[0.98]">
          <AlertCircleIcon className="w-6 h-6" />
          Flag Discrepancy / Damaged
        </button>
      </div>

    </div>
  );
}
