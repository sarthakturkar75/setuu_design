"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, UploadCloud, ShieldAlert, ShieldCheck, Radar, XCircle } from "lucide-react";
import Link from "next/link";

export default function UploadDropzonePage() {
  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="ClamAV Upload Dropzone States" 
        subtitle="Visual reference for the malware scanning component used globally for all file uploads"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Security</span>
            <span>/</span>
            <span className="text-on-surface font-medium">Dropzone</span>
          </div>
        }
        actions={
          <Link href="/admin/security" className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1400px] mx-auto w-full">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* State 1: Idle */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-on-surface">1. Idle State</h3>
            <p className="text-sm text-on-surface-variant mb-2">Default state waiting for user interaction.</p>
            <Card className="p-8 border-2 border-dashed border-outline-variant bg-surface-variant/30 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer min-h-[300px]">
              <UploadCloud className="w-12 h-12 text-on-surface-variant mb-4" />
              <h4 className="text-lg font-bold text-on-surface">Drag & Drop files here</h4>
              <p className="text-sm text-on-surface-variant mt-2 max-w-[250px]">
                or click to browse from your computer. Max file size: 50MB.
              </p>
            </Card>
          </div>

          {/* State 2: Scanning */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-on-surface">2. Active Scanning State</h3>
            <p className="text-sm text-on-surface-variant mb-2">File received, sending payload to ClamAV engine.</p>
            <Card className="p-8 border-2 border-primary/50 bg-primary/5 flex flex-col items-center justify-center text-center min-h-[300px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 mix-blend-overlay" />
              <div className="relative">
                <Radar className="w-12 h-12 text-primary mb-4 animate-spin" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-primary animate-ping opacity-20" />
              </div>
              <h4 className="text-lg font-bold text-primary">Scanning for threats...</h4>
              <span className="text-sm font-jetbrains text-on-surface-variant mt-2">Q3_Invoice_Payload.pdf (2.4 MB)</span>
              
              <div className="w-full max-w-[200px] h-1.5 bg-outline-variant rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-primary w-2/3 animate-pulse rounded-full" />
              </div>
            </Card>
          </div>

          {/* State 3: Clean */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-on-surface">3. Clean / Secure State</h3>
            <p className="text-sm text-on-surface-variant mb-2">ClamAV returned a clean bill of health. Ready for upload.</p>
            <Card className="p-8 border-2 border-semantic-emerald/50 bg-emerald-500/5 flex flex-col items-center justify-center text-center min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-semantic-emerald flex items-center justify-center mb-4 shadow-elevation-l2">
                <ShieldCheck className="w-8 h-8 text-on-primary" />
              </div>
              <h4 className="text-lg font-bold text-semantic-emerald">File verified - Secure</h4>
              <span className="text-sm font-jetbrains text-on-surface mt-2">Q3_Invoice_Payload.pdf (2.4 MB)</span>
              <p className="text-xs text-on-surface-variant mt-1">Hash: e3b0c442...b855</p>
            </Card>
          </div>

          {/* State 4: Infected */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-on-surface">4. Infected State</h3>
            <p className="text-sm text-on-surface-variant mb-2">ClamAV detected a malicious signature. Payload quarantined.</p>
            <Card className="p-8 border-2 border-crimson/50 bg-crimson/10 flex flex-col items-center justify-center text-center min-h-[300px] relative overflow-hidden">
              
              {/* Blurred File Preview Mock */}
              <div className="absolute inset-0 flex items-center justify-center blur-md opacity-30 select-none pointer-events-none">
                <div className="w-48 h-64 bg-surface shadow border border-outline-variant flex flex-col p-4">
                  <div className="w-full h-4 bg-outline-variant/50 mb-2 rounded" />
                  <div className="w-3/4 h-4 bg-outline-variant/50 mb-4 rounded" />
                  <div className="w-full h-32 bg-outline-variant/30 rounded" />
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <ShieldAlert className="w-16 h-16 text-crimson mb-4" />
                <h4 className="text-lg font-bold text-crimson bg-surface/80 backdrop-blur px-3 py-1 rounded">Malware Detected</h4>
                <span className="text-sm font-jetbrains text-on-surface mt-2 bg-surface/80 backdrop-blur px-3 py-1 rounded">blueprint_macro_v2.xlsm</span>
                <span className="text-xs font-bold text-crimson mt-2 uppercase tracking-wider bg-surface/80 backdrop-blur px-2 py-0.5 rounded border border-crimson/20">VBA:Downloader-A</span>
                
                <button className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-crimson text-white rounded-lg text-sm font-semibold hover:bg-crimson/90 transition-colors shadow-elevation-l1">
                  <XCircle className="w-4 h-4" />
                  Remove Payload
                </button>
              </div>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}
