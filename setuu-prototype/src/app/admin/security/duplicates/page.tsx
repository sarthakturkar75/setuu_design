"use client";

import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Copy, SplitSquareHorizontal, Merge, Trash2, ShieldCheck, FileText } from "lucide-react";
import Link from "next/link";

import React from "react";
export default function DuplicateResolutionPage() {
  const [duplicates, setDuplicates] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('duplicate_files').select('*');
      setDuplicates(data || []);
    }
    load();
  }, []);
  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Duplicate File Resolution Center" 
        subtitle="Compare and resolve file hash collisions across the storage network"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Security</span>
            <span>/</span>
            <span className="text-on-surface font-medium">Duplicates</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <Link href="/admin/security" className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-elevation-l1">
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1400px] mx-auto w-full flex flex-col gap-6">
        
        <div className="p-4 rounded-xl border border-semantic-amber/30 bg-semantic-amber/5 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-semantic-amber/20 flex items-center justify-center shrink-0">
              <Copy className="w-5 h-5 text-semantic-amber" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-on-surface leading-tight">Hash Collision Detected</span>
              <span className="text-sm text-on-surface-variant">An incoming upload perfectly matches the cryptographic hash of an existing file.</span>
            </div>
          </div>
          <span className="text-xs font-jetbrains font-bold text-semantic-amber bg-surface px-2 py-1 rounded shadow-sm border border-semantic-amber/20">
            SHA-256 MATCH
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Existing Record */}
          <Card className="flex-1 flex flex-col overflow-hidden border-2 border-primary/20">
            <div className="p-4 border-b border-outline-variant bg-primary/5 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-primary">Existing Record (System)</h3>
            </div>
            <div className="p-6 flex flex-col gap-6">
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">File Name</span>
                <span className="text-lg font-medium text-on-surface">Alpha_Tower_Structural_Specs.pdf</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Storage Location</span>
                <span className="font-jetbrains text-sm text-on-surface-variant break-all">s3://setuu-prod/projects/alpha/docs/Alpha_Tower_Structural_Specs.pdf</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">File Size</span>
                  <span className="font-jetbrains text-on-surface">14.2 MB</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Uploader</span>
                  <span className="text-on-surface">Sarah Jenkins</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Upload Date</span>
                  <span className="font-jetbrains text-sm text-on-surface">Oct 12, 2026 - 09:14 UTC</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Last Accessed</span>
                  <span className="font-jetbrains text-sm text-on-surface">Oct 20, 2026 - 11:30 UTC</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-surface-variant/30 rounded-lg border border-outline-variant mt-auto">
                <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">SHA-256 Hash</span>
                <span className="font-jetbrains text-sm text-primary break-all">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </div>

            </div>
          </Card>

          {/* VS Divider (Desktop) */}
          <div className="hidden lg:flex flex-col items-center justify-center px-4">
            <div className="w-12 h-12 rounded-full bg-surface-variant border-2 border-outline-variant flex items-center justify-center shadow-elevation-l1 relative z-10">
              <span className="font-bold text-on-surface-variant font-jetbrains">VS</span>
            </div>
            <div className="w-px h-full bg-outline-variant absolute" />
          </div>

          {/* Incoming Upload */}
          <Card className="flex-1 flex flex-col overflow-hidden border-2 border-semantic-amber/30 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-[0.03] pointer-events-none" />
            <div className="p-4 border-b border-outline-variant bg-semantic-amber/10 flex items-center gap-2">
              <Copy className="w-5 h-5 text-semantic-amber" />
              <h3 className="font-semibold text-semantic-amber">Incoming Upload</h3>
            </div>
            <div className="p-6 flex flex-col gap-6 relative z-10">
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">File Name</span>
                <span className="text-lg font-medium text-on-surface">Copy of Alpha_Tower_Structural_Specs(1).pdf</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Upload Context</span>
                <span className="font-jetbrains text-sm text-on-surface-variant break-all">Project: Alpha Tower / Module: Drawings / Folder: Root</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">File Size</span>
                  <span className="font-jetbrains text-on-surface">14.2 MB</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Uploader</span>
                  <span className="text-on-surface">Mike Torres</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Upload Date</span>
                  <span className="font-jetbrains text-sm text-on-surface">Pending...</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Last Accessed</span>
                  <span className="font-jetbrains text-sm text-on-surface">N/A</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-surface-variant/30 rounded-lg border border-outline-variant mt-auto">
                <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">SHA-256 Hash</span>
                <span className="font-jetbrains text-sm text-primary break-all">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </div>

            </div>
          </Card>

        </div>

        {/* Resolution Actions */}
        <Card className="p-6">
          <h3 className="font-semibold text-on-surface mb-4">Resolution Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant bg-surface hover:border-primary hover:bg-primary/5 transition-colors group">
              <Merge className="w-8 h-8 text-on-surface-variant group-hover:text-primary mb-2 transition-colors" />
              <span className="font-semibold text-on-surface">Merge Metadata</span>
              <span className="text-xs text-on-surface-variant mt-1 text-center">Keep existing file, but link it to the new upload context.</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant bg-surface hover:border-semantic-emerald hover:bg-emerald-500/5 transition-colors group">
              <SplitSquareHorizontal className="w-8 h-8 text-on-surface-variant group-hover:text-semantic-emerald mb-2 transition-colors" />
              <span className="font-semibold text-on-surface">Keep Both</span>
              <span className="text-xs text-on-surface-variant mt-1 text-center">Allow the duplicate upload to proceed normally.</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant bg-surface hover:border-crimson hover:bg-crimson/5 transition-colors group">
              <Trash2 className="w-8 h-8 text-on-surface-variant group-hover:text-crimson mb-2 transition-colors" />
              <span className="font-semibold text-on-surface">Purge Duplicate</span>
              <span className="text-xs text-on-surface-variant mt-1 text-center">Reject the incoming upload entirely to save storage.</span>
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
}
