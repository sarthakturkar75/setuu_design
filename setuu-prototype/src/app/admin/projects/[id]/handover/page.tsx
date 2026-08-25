"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/contexts/ToastContext";
import { createClient } from "@/lib/supabase/client";
import { ManageAssetsModal } from "@/components/ui/ManageAssetsModal";
import {
  ShieldAlertIcon,
  CheckCircleIcon,
  XCircleIcon,
  FileTextIcon,
  QrCodeIcon,
  BanknoteIcon,
  PenToolIcon,
  StarIcon,
  PlayIcon,
  BoxIcon,
} from "lucide-react";

import {
  getHandovers,
  createHandover,
  checkHandoverGateways,
  generateOMAndAsBuilts,
  releaseRetentionPayments,
  generateAssetQRCodes,
  submitClientSignOff,
} from "@/app/actions/handoverActions";

export default function ProjectHandoverConsole() {
  const params = useParams();
  const projectId = params?.id as string;
  const toast = useToast();
  const supabase = createClient();

  const [handover, setHandover] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAssetsModal, setShowAssetsModal] = useState(false);

  // Enterprise States
  const [gatewayStatus, setGatewayStatus] = useState<{
    allowed: boolean;
    reasons: string[];
  } | null>(null);
  const [npsInput, setNpsInput] = useState("10");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [generatedQRs, setGeneratedQRs] = useState<any[]>([]);
  const [generatedDocUrl, setGeneratedDocUrl] = useState<string | null>(null);

  const fetchHandoverData = useCallback(async () => {
    setLoading(true);
    try {
      const handovers = await getHandovers(projectId);
      if (handovers && handovers.length > 0) {
        const currentPkg = handovers[0];
        setHandover(currentPkg);
        setGeneratedDocUrl(currentPkg.document_url || null);

        // Run Live Gateway Check
        const status = await checkHandoverGateways(projectId);
        setGatewayStatus(status);
      } else {
        setHandover(null);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
    setLoading(false);
  }, [projectId, toast]);

  useEffect(() => {
    if (projectId) fetchHandoverData();
  }, [projectId, fetchHandoverData]);

  const handleInitCloseout = async () => {
    setActionLoading(true);
    const res = await createHandover(projectId, {
      package_name: "Final Project Closeout Dossier",
    });
    if (res.success) {
      toast.success("Closeout sequence initiated.");
      await fetchHandoverData();
    } else {
      toast.error(res.error || "Failed to initiate closeout.");
    }
    setActionLoading(false);
  };

  const handleGenerateManuals = async () => {
    setActionLoading(true);
    toast.info("Generating native PDF... This may take a moment.");
    const res = await generateOMAndAsBuilts(handover.id, projectId);
    if (res.success) {
      toast.success("O&M Manual generated and uploaded to Storage!");
      setGeneratedDocUrl(res.url || null);
      await fetchHandoverData();
    } else {
      toast.error(res.error || "Failed to generate PDF.");
    }
    setActionLoading(false);
  };

  const handleGenerateQRs = async () => {
    setActionLoading(true);
    const res = await generateAssetQRCodes(projectId);
    if (res.success && res.qrCodes) {
      toast.success("QR Codes generated successfully.");
      setGeneratedQRs(res.qrCodes);
    } else {
      toast.error(res.error || "Failed to generate QR codes.");
    }
    setActionLoading(false);
  };

  const handleClientSignOff = async () => {
    if (!signatureFile) {
      toast.error("You must upload a valid signature image file.");
      return;
    }
    setActionLoading(true);

    const fileName = `signatures/${handover.id}-${Date.now()}-${signatureFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("signatures")
      .upload(fileName, signatureFile);

    if (uploadError) {
      toast.error("Failed to upload signature image: " + uploadError.message);
      setActionLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("signatures")
      .getPublicUrl(fileName);
    const res = await submitClientSignOff(
      handover.id,
      Number(npsInput),
      urlData.publicUrl,
    );

    if (res.success) {
      toast.success("Client officially signed off and NPS recorded!");
      await fetchHandoverData();
    } else {
      toast.error(res.error || "Failed to submit sign-off.");
    }
    setActionLoading(false);
  };

  const handleRetentionRelease = async () => {
    setActionLoading(true);
    const res = await releaseRetentionPayments(projectId);
    if (res.success) {
      toast.success(res.message || "Retention released.");
    } else {
      toast.error(res.error || "Failed to release retention payments.");
    }
    setActionLoading(false);
  };

  if (loading)
    return (
      <div className="p-12 text-center animate-pulse text-on-surface-variant">
        Loading Closeout Console...
      </div>
    );

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <PageHeader
        title="Project Handover Console"
        subtitle="Manage the final phase of the project. Ensure all documentation, physical assets, and compliance certificates are transferred to the client."
        actions={
          <Button variant="outline" onClick={() => setShowAssetsModal(true)}>
            <BoxIcon className="w-4 h-4 mr-2" /> Manage Physical Assets
          </Button>
        }
      />

      {/* Asset Management Modal */}
      {showAssetsModal && (
        <ManageAssetsModal
          projectId={projectId}
          onClose={() => setShowAssetsModal(false)}
        />
      )}

      {!handover ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-outline-variant bg-surface-variant/10">
          <ShieldAlertIcon className="w-12 h-12 text-primary mb-4 opacity-80" />
          <h2 className="text-xl font-bold text-on-surface mb-2 font-merriweather">
            No Closeout Package Exists
          </h2>
          <p className="text-on-surface-variant max-w-md mb-6">
            This project has not yet entered the handover phase. Initiate the
            closeout sequence to begin generating O&M manuals and unlocking
            smart gateways.
          </p>
          <Button
            variant="primary"
            onClick={handleInitCloseout}
            disabled={actionLoading}
          >
            <PlayIcon className="w-4 h-4 mr-2" />
            {actionLoading ? "Initiating..." : "Initiate Closeout Sequence"}
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="p-6 flex justify-between items-center bg-surface-variant/20 border-primary/20">
            <div>
              <h2 className="text-lg font-bold text-on-surface">
                {handover.package_name}
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Status dictates which actions are currently unlocked below.
              </p>
            </div>
            <StatusBadge
              label={handover.status}
              tone={
                handover.status === "Approved"
                  ? "emerald"
                  : handover.status === "Draft"
                    ? "slate"
                    : "amber"
              }
            />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Smart Gateways Check */}
            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
                <ShieldAlertIcon className="w-4 h-4" /> 1. Real-Time Gateways
              </h3>
              {gatewayStatus ? (
                gatewayStatus.allowed ? (
                  <div className="flex items-center gap-3 text-semantic-emerald p-4 bg-semantic-emerald/10 rounded-lg border border-semantic-emerald/20">
                    <CheckCircleIcon className="w-6 h-6 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">All Clear</p>
                      <p className="text-xs mt-0.5">
                        No critical issues or pending VOs detected in the
                        database.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 text-semantic-crimson p-4 bg-semantic-crimson/10 rounded-lg border border-semantic-crimson/20">
                    <XCircleIcon className="w-6 h-6 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm mb-1">Handover Blocked</p>
                      <ul className="text-xs space-y-1 list-disc list-inside ml-2">
                        {gatewayStatus.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              ) : null}
            </Card>

            {/* 2. Documents & QR */}
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                <FileTextIcon className="w-4 h-4" /> 2. Native File Generation
              </h3>

              {generatedDocUrl && (
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex justify-between items-center text-sm">
                  <span className="font-semibold text-primary">
                    PDF Manual Generated
                  </span>
                  <a
                    href={generatedDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-bold"
                  >
                    View PDF
                  </a>
                </div>
              )}

              <div className="flex flex-col xl:flex-row gap-3">
                <Button
                  variant="primary"
                  className="flex-1 text-xs sm:text-sm"
                  disabled={
                    actionLoading ||
                    !gatewayStatus?.allowed ||
                    handover.status !== "Draft"
                  }
                  onClick={handleGenerateManuals}
                >
                  {actionLoading ? "Generating..." : "Generate O&M PDF"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm"
                  disabled={actionLoading}
                  onClick={handleGenerateQRs}
                >
                  <QrCodeIcon className="w-4 h-4 mr-2" /> Retrieve QR Tags
                </Button>
              </div>

              {generatedQRs.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 border border-outline-variant/30 rounded-lg bg-surface-variant/20">
                  {generatedQRs.map((qr) => (
                    <div
                      key={qr.assetId}
                      className="flex flex-col items-center gap-2"
                    >
                      <img
                        src={qr.qrUrl}
                        alt={`QR`}
                        className="w-16 h-16 rounded shadow-sm border border-outline-variant/50 bg-white p-1"
                      />
                      <span className="text-[10px] text-center font-semibold text-on-surface-variant leading-tight truncate w-full">
                        {qr.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* 3. Client Sign-off & NPS */}
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                <PenToolIcon className="w-4 h-4" /> 3. Official Client Sign-off
              </h3>
              {handover.status === "Approved" ? (
                <div className="text-sm text-semantic-emerald font-semibold flex flex-col gap-3 p-4 bg-semantic-emerald/10 border border-semantic-emerald/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" /> Client digitally
                    signed.
                  </div>
                  <a
                    href={handover.client_signature_url}
                    target="_blank"
                    className="underline text-xs ml-7 font-bold text-semantic-emerald"
                  >
                    View Signature Record
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-3 py-2 border border-outline-variant rounded-lg w-full max-w-[200px]">
                    <StarIcon className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold">NPS Score:</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={npsInput}
                      onChange={(e) => setNpsInput(e.target.value)}
                      className="w-12 text-center bg-transparent outline-none font-bold text-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-2 border border-dashed border-outline-variant p-4 rounded-lg bg-surface-variant/10">
                    <label className="text-xs font-semibold text-on-surface">
                      Upload Signature Image (Required)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setSignatureFile(e.target.files?.[0] || null)
                      }
                      className="text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    disabled={
                      actionLoading ||
                      handover.status !== "Pending Signature" ||
                      !signatureFile
                    }
                    onClick={handleClientSignOff}
                  >
                    Submit Client Acceptance
                  </Button>
                </div>
              )}
            </Card>

            {/* 4. Financial Release */}
            <Card className="p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 mb-4">
                  <BanknoteIcon className="w-4 h-4" /> 4. Vendor Retention
                </h3>
                <p className="text-sm text-on-surface-variant mb-6">
                  Release the final 5% retention pool back to the vendors. This
                  will fire a webhook directly to your integrated Accounting
                  ERP. Requires Handover to be 100% Approved.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full text-semantic-emerald border-semantic-emerald/30 hover:bg-semantic-emerald/10 font-bold"
                disabled={actionLoading || handover.status !== "Approved"}
                onClick={handleRetentionRelease}
              >
                <BanknoteIcon className="w-4 h-4 mr-2" />
                Trigger ERP Retention Release
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
