"use client";

import { useState } from "react";
import { UploadCloudIcon, RadarIcon, ShieldCheckIcon, AlertOctagonIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

type ScanState = "idle" | "scanning" | "clean" | "infected";

export default function DropzonePage() {
  const [scanState, setScanState] = useState<ScanState>("idle");

  const handleSimulateUpload = (result: "clean" | "infected") => {
    setScanState("scanning");
    setTimeout(() => {
      setScanState(result);
    }, 2500); // simulate 2.5s scan
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full pt-12 pb-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">ClamAV Upload Dropzone States</CardTitle>
          <CardDescription>
            Demonstrates the secure upload pipeline with inline virus scanning feedback.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-4">
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => handleSimulateUpload("clean")}
              disabled={scanState === "scanning"}
              className="px-4 py-2 bg-surface-container border border-outline rounded text-sm font-medium hover:bg-surface-container-high transition-colors disabled:opacity-50"
            >
              Simulate Clean File
            </button>
            <button 
              onClick={() => handleSimulateUpload("infected")}
              disabled={scanState === "scanning"}
              className="px-4 py-2 bg-surface-container border border-outline rounded text-sm font-medium hover:bg-surface-container-high transition-colors disabled:opacity-50"
            >
              Simulate Infected File
            </button>
            <button 
              onClick={() => setScanState("idle")}
              disabled={scanState === "idle" || scanState === "scanning"}
              className="px-4 py-2 bg-surface-container border border-outline rounded text-sm font-medium hover:bg-surface-container-high transition-colors disabled:opacity-50"
            >
              Reset
            </button>
          </div>

          <div 
            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all duration-500
              ${scanState === "idle" ? "border-outline-variant bg-surface hover:border-primary/50 cursor-pointer" : ""}
              ${scanState === "scanning" ? "border-primary/50 bg-primary/5" : ""}
              ${scanState === "clean" ? "border-semantic-emerald/50 bg-semantic-emerald/5" : ""}
              ${scanState === "infected" ? "border-semantic-crimson/50 bg-semantic-crimson/5" : ""}
            `}
          >
            {scanState === "idle" && (
              <>
                <UploadCloudIcon className="w-12 h-12 text-on-surface-variant mb-4" />
                <h3 className="text-lg font-medium text-on-surface">Drag & drop to upload</h3>
                <p className="text-sm text-on-surface-variant mt-1">Files will be automatically scanned by ClamAV</p>
              </>
            )}

            {scanState === "scanning" && (
              <>
                <div className="relative mb-4">
                  <RadarIcon className="w-12 h-12 text-primary animate-spin" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                </div>
                <h3 className="text-lg font-medium text-primary">Scanning for threats...</h3>
                <p className="text-sm text-on-surface-variant mt-1">Analyzing file signatures against the latest definitions</p>
              </>
            )}

            {scanState === "clean" && (
              <>
                <ShieldCheckIcon className="w-12 h-12 text-semantic-emerald mb-4" />
                <h3 className="text-lg font-medium text-semantic-emerald">File is Clean</h3>
                <p className="text-sm text-semantic-emerald/80 mt-1">Upload successful and verified</p>
              </>
            )}

            {scanState === "infected" && (
              <>
                <AlertOctagonIcon className="w-12 h-12 text-semantic-crimson mb-4" />
                <h3 className="text-lg font-medium text-semantic-crimson">Threat Detected!</h3>
                <p className="text-sm text-semantic-crimson/80 mt-1 font-jetbrains-mono bg-semantic-crimson/10 px-3 py-1 rounded inline-block mt-2">
                  Trojan.GenericKD.43981
                </p>
                <p className="text-sm text-on-surface-variant mt-3">Upload blocked and incident logged.</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
