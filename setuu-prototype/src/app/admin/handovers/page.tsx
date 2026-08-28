"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TabBar } from "@/components/ui/TabBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { useToast } from "@/contexts/ToastContext";
import { createClient } from "@/lib/supabase/client";
import {
  FileCheckIcon,
  CalendarIcon,
  PlusIcon,
  X,
  ShieldAlertIcon,
  CheckCircleIcon,
  XCircleIcon,
  FileTextIcon,
  QrCodeIcon,
  BanknoteIcon,
  PenToolIcon,
  StarIcon,
  UploadIcon,
} from "lucide-react";

import {
  getHandovers,
  checkHandoverGateways,
  generateOMAndAsBuilts,
  releaseRetentionPayments,
  generateAssetQRCodes,
  submitClientSignOff,
} from "@/app/actions/handoverActions";
import { getMeetings } from "@/app/actions/meetingActions";
import { useRouter } from "next/navigation";

export default function PMHandoversHub() {
  const [activeTab, setActiveTab] = useState("packages");
  const [handovers, setHandovers] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);

  // Handover Modal State
  const [selectedHandover, setSelectedHandover] = useState<any | null>(null);
  const [gatewayStatus, setGatewayStatus] = useState<{
    allowed: boolean;
    reasons: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Real Sign-off State
  const [npsInput, setNpsInput] = useState("10");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [generatedQRs, setGeneratedQRs] = useState<any[]>([]);
  const [generatedDocUrl, setGeneratedDocUrl] = useState<string | null>(null);

  const toast = useToast();
  const supabase = createClient();

  const fetchData = React.useCallback(async () => {
    const fetchedHandovers = await getHandovers();
    const fetchedMeetings = await getMeetings();
    setHandovers(fetchedHandovers);
    setMeetings(fetchedMeetings);
  }, []);

  const router = useRouter();

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openHandoverModal = async (pkg: any) => {
    setSelectedHandover(pkg);
    setGatewayStatus(null);
    setGeneratedQRs([]);
    setGeneratedDocUrl(pkg.document_url || null);
    setSignatureFile(null);
    setLoading(true);

    // Real Gateway Check
    try {
      const status = await checkHandoverGateways(pkg.project_id);
      setGatewayStatus(status);
    } catch (e: any) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  const handleGenerateManuals = async () => {
    if (!selectedHandover) return;
    setLoading(true);
    toast.info("Generating native PDF... This may take a moment.");

    const res = await generateOMAndAsBuilts(selectedHandover.id, selectedHandover.project_id);
    if (res.success) {
      toast.success("O&M Manual generated and uploaded to Storage!");
      setGeneratedDocUrl(res.url || null);
      await fetchData();
    } else {
      // FIX: Added fallback string
      toast.error(res.error || "Failed to generate PDF.");
    }
    setLoading(false);
  };

  const handleGenerateQRs = async () => {
    if (!selectedHandover) return;
    setLoading(true);
    const res = await generateAssetQRCodes(selectedHandover.project_id);
    if (res.success && res.qrCodes) {
      toast.success("QR Codes generated successfully.");
      setGeneratedQRs(res.qrCodes);
    } else {
      // FIX: Added fallback string
      toast.error(res.error || "Failed to generate QR codes.");
    }
    setLoading(false);
  };

  const handleRetentionRelease = async () => {
    if (!selectedHandover) return;
    setLoading(true);
    const res = await releaseRetentionPayments(selectedHandover.project_id);
    if (res.success) {
      toast.success(res.message || "Retention released.");
    } else {
      // FIX: Added fallback string
      toast.error(res.error || "Failed to release retention payments.");
    }
    setLoading(false);
  };

  const handleClientSignOff = async () => {
    if (!selectedHandover || !signatureFile) {
      toast.error("You must upload a valid signature image file.");
      return;
    }
    setLoading(true);

    const fileName = `signatures/${selectedHandover.id}-${Date.now()}-${signatureFile.name}`;
    const { error: uploadError } = await supabase.storage.from("signatures").upload(fileName, signatureFile);

    if (uploadError) {
      toast.error("Failed to upload signature image: " + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("signatures").getPublicUrl(fileName);

    const res = await submitClientSignOff(selectedHandover.id, Number(npsInput), urlData.publicUrl);

    if (res.success) {
      toast.success("Client officially signed off and NPS recorded!");
      await fetchData();
      setSelectedHandover(null);
    } else {
      // FIX: Added fallback string
      toast.error(res.error || "Failed to submit sign-off.");
    }
    setLoading(false);
  };

  const getCompleteness = (status: string) => {
    if (status === "Approved") return 100;
    if (status === "Pending Signature") return 85;
    return 30; // Draft
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto relative">
      <PageHeader
        title="Handovers & Closeout"
        subtitle="Manage Smart Gateways, Native O&M Generation, and Retention Triggers."
        actions={
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                toast.info("Go to a Project to create a Meeting");
                router.push("/admin/projects");
              }}
            >
              <PlusIcon className="w-4 h-4 mr-2" /> New Meeting
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                toast.info("Go to a Project to initiate Closeout");
                router.push("/admin/projects");
              }}
            >
              <FileCheckIcon className="w-4 h-4 mr-2" /> Init Closeout
            </Button>
          </div>
        }
      />

      <TabBar
        tabs={[
          { id: "packages", label: "Active Closeout Packages" },
          { id: "meetings", label: "Client Meetings" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "packages" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {handovers.map((pkg) => {
            const comp = getCompleteness(pkg.status);
            return (
              <Card
                key={pkg.id}
                className="p-5 flex flex-col gap-4 cursor-pointer hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
                onClick={() => openHandoverModal(pkg)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                      {pkg.project_name || "Unknown Project"}
                    </div>
                    <h4 className="font-bold text-on-surface">
                      {pkg.package_name}
                    </h4>
                  </div>
                  <StatusBadge
                    label={pkg.status}
                    tone={
                      pkg.status === "Approved"
                        ? "emerald"
                        : pkg.status === "Draft"
                          ? "slate"
                          : "amber"
                    }
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-on-surface-variant font-medium">
                    <span>Closeout Progress</span>
                    <span>{comp}%</span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${comp}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === "meetings" && (
        <DataTable
          data={meetings}
          columns={[
            {
              header: "Date",
              key: "meeting_date",
              cell: (row: any) => (
                <span className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-outline" />{" "}
                  {new Date(row.meeting_date).toLocaleDateString()}
                </span>
              ),
            },
            {
              header: "Project",
              key: "project_name",
              cell: (row: any) => <>{row.project_name || "Unknown Project"}</>,
            },
            {
              header: "Topic",
              key: "title",
              cell: (row: any) => (
                <span className="font-medium text-on-surface">{row.title}</span>
              ),
            },
            {
              header: "Status",
              key: "status",
              cell: (row: any) => (
                <StatusBadge
                  label={row.status}
                  tone={row.status === "Completed" ? "emerald" : "sky"}
                />
              ),
            },
            {
              header: "Attendees",
              key: "attendees",
              cell: (row: any) => <>{row.attendees}</>,
            },
          ]}
        />
      )}

      {/* ENTERPRISE HANDOVER MODAL */}
      {selectedHandover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface-container-lowest w-full max-w-3xl rounded-xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/30">
            <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface">
              <div>
                <h2 className="text-xl font-bold text-on-surface font-merriweather">
                  Closeout: {selectedHandover.package_name}
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {selectedHandover.project_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedHandover(null)}
                className="p-2 hover:bg-surface-variant rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
              {/* 1. Smart Gateways Check */}
              <div className="p-4 rounded-xl border border-outline-variant bg-surface">
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
                  <ShieldAlertIcon className="w-4 h-4" /> 1. Real-Time Gateways
                </h3>
                {gatewayStatus ? (
                  gatewayStatus.allowed ? (
                    <div className="flex items-center gap-3 text-semantic-emerald p-3 bg-semantic-emerald/10 rounded-lg border border-semantic-emerald/20">
                      <CheckCircleIcon className="w-6 h-6" />
                      <div>
                        <p className="font-bold text-sm">All Clear</p>
                        <p className="text-xs">
                          No critical issues or pending VOs detected in the
                          database.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 text-semantic-crimson p-3 bg-semantic-crimson/10 rounded-lg border border-semantic-crimson/20">
                      <XCircleIcon className="w-6 h-6 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm mb-1">
                          Handover Blocked
                        </p>
                        <ul className="text-xs space-y-1 list-disc list-inside ml-2">
                          {gatewayStatus.reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="text-sm text-on-surface-variant animate-pulse">
                    Running live database checks...
                  </p>
                )}
              </div>

              {/* 2. Documents & QR */}
              <div className="p-4 rounded-xl border border-outline-variant bg-surface space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4" /> 2. Native File Generation
                  & Tagging
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

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="primary"
                    className="flex-1"
                    disabled={loading || !gatewayStatus?.allowed}
                    onClick={handleGenerateManuals}
                  >
                    {loading
                      ? "Generating Stream..."
                      : "Generate O&M & As-Builts PDF"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={loading}
                    onClick={handleGenerateQRs}
                  >
                    <QrCodeIcon className="w-4 h-4 mr-2" /> Retrieve Asset QR
                    Tags
                  </Button>
                </div>

                {/* Render Real QR Codes */}
                {generatedQRs.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-outline-variant/30 rounded-lg bg-surface-variant/20">
                    {generatedQRs.map((qr) => (
                      <div
                        key={qr.assetId}
                        className="flex flex-col items-center gap-2"
                      >
                        <img
                          src={qr.qrUrl}
                          alt={`QR for ${qr.name}`}
                          className="w-20 h-20 rounded shadow-sm border border-outline-variant/50 bg-white p-1"
                        />
                        <span className="text-[10px] text-center font-semibold text-on-surface-variant leading-tight">
                          {qr.name}
                          <br />({qr.tag})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Client Sign-off & NPS */}
              <div className="p-4 rounded-xl border border-outline-variant bg-surface space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                  <PenToolIcon className="w-4 h-4" /> 3. Official Client
                  Sign-off
                </h3>
                {selectedHandover.status === "Approved" ? (
                  <div className="text-sm text-semantic-emerald font-semibold flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5" /> Client digitally
                      signed.
                    </div>
                    <a
                      href={selectedHandover.client_signature_url}
                      target="_blank"
                      className="underline text-xs ml-7 text-semantic-emerald/80"
                    >
                      View Record
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center gap-2 px-3 py-2 border border-outline-variant rounded-lg">
                        <StarIcon className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-semibold">
                          NPS Score:
                        </span>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={npsInput}
                          onChange={(e) => setNpsInput(e.target.value)}
                          className="w-12 text-center bg-transparent outline-none font-bold text-primary"
                        />
                      </div>
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
                        loading ||
                        selectedHandover.status !== "Pending Signature" ||
                        !signatureFile
                      }
                      onClick={handleClientSignOff}
                    >
                      Submit Official Client Acceptance
                    </Button>
                  </div>
                )}
              </div>

              {/* 4. Financial Release */}
              <div className="p-4 rounded-xl border border-outline-variant bg-surface">
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 mb-4">
                  <BanknoteIcon className="w-4 h-4" /> 4. Vendor Retention
                </h3>
                <Button
                  variant="outline"
                  className="w-full text-semantic-emerald border-semantic-emerald/30 hover:bg-semantic-emerald/10"
                  disabled={loading || selectedHandover.status !== "Approved"}
                  onClick={handleRetentionRelease}
                >
                  <BanknoteIcon className="w-4 h-4 mr-2" />
                  Trigger Real Retention Release (Accounting Webhook)
                </Button>
                <p className="text-xs text-on-surface-variant text-center mt-2">
                  Requires Handover to be 100% Approved by Client.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
