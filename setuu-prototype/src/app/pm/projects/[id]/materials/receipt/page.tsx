"use client";
import * as React from "react";
import { FormField } from "@/components/ui/FormField";
import { TextInput } from "@/components/ui/TextInput";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { Button } from "@/components/ui/Button";
import { CameraIcon, CheckCircleIcon } from "lucide-react";

export default function MaterialReceiptPage() {
  const [isScanned, setIsScanned] = React.useState(false);

  return (
    <div className="p-6 max-w-[600px] mx-auto space-y-8 pb-32">
      <div>
        <h2 className="text-2xl font-bold font-merriweather text-on-surface">Material Receipt</h2>
        <p className="text-on-surface-variant mt-1">Scan a packing slip or enter details manually to log incoming materials.</p>
      </div>

      {!isScanned ? (
        <div className="bg-surface-container border border-outline-variant border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <CameraIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-on-surface">Scan Packing Slip</h3>
            <p className="text-sm text-on-surface-variant max-w-[250px] mx-auto mt-2">Use your device camera to automatically extract materials and quantities using AI.</p>
          </div>
          <Button variant="primary" onClick={() => setIsScanned(true)} className="mt-4">
            Open Camera
          </Button>
          <div className="text-xs text-on-surface-variant uppercase tracking-widest font-bold my-4">OR</div>
          <Button variant="outline" onClick={() => setIsScanned(true)}>
            Enter Manually
          </Button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); alert("Successfully submitted!"); }} className="space-y-6 bg-surface-container border border-outline-variant rounded-xl p-6">
          <div className="flex items-center gap-2 text-semantic-emerald mb-6 bg-semantic-emerald-bg/10 p-3 rounded-lg border border-semantic-emerald/20">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="font-medium text-sm">Packing slip scanned successfully</span>
          </div>

          <FormField label="Purchase Order Reference">
            <TextInput defaultValue="PO-2026-8891" />
          </FormField>

          <FormField label="Items Received">
            <div className="space-y-3">
              <div className="flex gap-3 items-center">
                <div className="flex-1"><TextInput defaultValue="Rebar #5 (5/8 inch)" /></div>
                <div className="w-24"><TextInput defaultValue="150" /></div>
                <div className="text-sm font-medium text-on-surface-variant w-12">tons</div>
              </div>
              <Button variant="ghost" size="sm" type="button" className="w-full text-primary">+ Add Item</Button>
            </div>
          </FormField>

          <FormField label="Attach Photos (Optional)">
            <FileDropzone onFileSelect={() => { }} />
          </FormField>

          <div className="pt-4">
            <Button variant="primary" className="w-full" type="submit">Confirm Receipt</Button>
          </div>
        </form>
      )}
    </div>
  );
}
