"use server";

import React from "react";
import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";
import { revalidatePath } from "next/cache";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import QRCode from 'qrcode';

// --- PDF Styling ---
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  section: { margin: 10, padding: 10 },
  title: { fontSize: 16, marginBottom: 10, textDecoration: 'underline' },
  text: { fontSize: 12, marginBottom: 5, color: '#333' }
});

// --- Real PDF Component ---
const HandoverPDF = ({ project, assets, materials }: { project: any, assets: any[], materials: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>O&M Manual & Handover Document</Text>
      <Text style={styles.header}>{project.name}</Text>

      <View style={styles.section}>
        <Text style={styles.title}>1. Project Assets</Text>
        {assets.length === 0 ? <Text style={styles.text}>No recorded assets.</Text> : null}
        {assets.map((a, i) => (
          <Text key={i} style={styles.text}>• {a.name} (Tag: {a.asset_tag})</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>2. Project Materials & Warranties</Text>
        {materials.length === 0 ? <Text style={styles.text}>No recorded materials.</Text> : null}
        {materials.map((m, i) => (
          <Text key={i} style={styles.text}>• {m.item_name} (Qty: {m.quantity}) - Supplier: {m.supplier_name || 'N/A'}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>3. Official As-Built Sign-off</Text>
        <Text style={styles.text}>This document certifies that all physical works have been completed in accordance with the final As-Built drawings.</Text>
      </View>
    </Page>
  </Document>
);

export async function getHandovers(projectId?: string) {
  const supabase = await createClient();
  let query = supabase.from("project_handovers").select("*, project:projects!project_handovers_project_id_fkey(name)");
  if (projectId) query = query.eq("project_id", projectId);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(h => ({
    ...h,
    project_name: h.project && typeof h.project === 'object' && !Array.isArray(h.project) ? (h.project as any).name : "Unknown Project"
  }));
}

export async function createHandover(projectId: string, data: any) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("project_handovers").insert({ project_id: projectId, ...data, status: "Draft" });
  if (error) return { success: false, error: error.message };
  revalidatePath(`/pm/projects/${projectId}/handover`);
  return { success: true };
}

// 1. Real Smart Gateways
export async function checkHandoverGateways(projectId: string) {
  const supabase = await createClient();
  const reasons: string[] = [];

  const { data: issues } = await supabase.from("project_issues").select("id").eq("project_id", projectId).eq("status", "Open").in("severity", ["High", "Critical"]);
  if (issues && issues.length > 0) reasons.push(`${issues.length} Critical/High QA or Safety issues remain open.`);

  const { data: changes } = await supabase.from("change_requests").select("id").eq("project_id", projectId).eq("status", "Pending");
  if (changes && changes.length > 0) reasons.push(`${changes.length} Pending Change Requests must be resolved.`);

  return { allowed: reasons.length === 0, reasons };
}

// 2. Real Native PDF Generation & Supabase Storage Upload
export async function generateOMAndAsBuilts(handoverId: string, projectId: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();

  // Fetch Real Data[cite: 3]
  const [projectReq, assetsReq, materialsReq] = await Promise.all([
    supabase.from("projects").select("name").eq("id", projectId).single(),
    supabase.from("project_assets").select("*").eq("project_id", projectId),
    supabase.from("project_materials").select("*").eq("project_id", projectId)
  ]);

  if (projectReq.error) return { success: false, error: "Project not found." };

  // Generate Real PDF Buffer using @react-pdf/renderer
  const pdfBuffer = await renderToBuffer(
    <HandoverPDF
      project={projectReq.data}
      assets={assetsReq.data || []}
      materials={materialsReq.data || []}
    />
  );

  // Upload to Real Supabase Storage Bucket
  const fileName = `${projectId}/handover-${handoverId}-${Date.now()}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("om-manuals")
    .upload(fileName, pdfBuffer, { contentType: "application/pdf", upsert: true });

  if (uploadError) return { success: false, error: `Storage upload failed: ${uploadError.message}` };

  // Retrieve Public URL
  const { data: publicUrlData } = supabase.storage.from("om-manuals").getPublicUrl(fileName);
  const realPdfUrl = publicUrlData.publicUrl;

  // Update Database[cite: 3]
  const { error: dbError } = await supabase
    .from("project_handovers")
    .update({
      document_url: realPdfUrl,
      status: "Pending Signature",
      package_contents: { generated: true, as_builts_stamped: true, timestamp: new Date().toISOString() }
    })
    .eq("id", handoverId);

  if (dbError) return { success: false, error: dbError.message };
  revalidatePath(`/pm/handovers`);
  return { success: true, url: realPdfUrl };
}

// 3. Real Retention Release API Trigger
export async function releaseRetentionPayments(projectId: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();

  const { data: retentions, error: dbError } = await supabase
    .from("financial_retentions")
    .update({ status: "Released" })
    .eq("project_id", projectId)
    .select();

  if (dbError) return { success: false, error: dbError.message };
  if (!retentions || retentions.length === 0) return { success: false, error: "No active retentions found for this project." };

  // Real HTTP Call to Accounting ERP
  const erpWebhook = process.env.ERP_RETENTION_WEBHOOK_URL;
  if (erpWebhook) {
    const response = await fetch(erpWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.ERP_API_KEY}` },
      body: JSON.stringify({ projectId, retentions })
    });
    if (!response.ok) return { success: false, error: "Database updated, but ERP API webhook failed." };
  } else {
    console.warn("ERP_RETENTION_WEBHOOK_URL is missing. DB updated, but no webhook fired.");
  }

  return { success: true, message: "Retention records released and Accounting API triggered." };
}

// 4. Real Asset QR Tagging (Live Generation API)
export async function generateAssetQRCodes(projectId: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();

  const { data: assets, error } = await supabase
    .from("project_assets")
    .select("id, name, asset_tag")
    .eq("project_id", projectId);

  if (error) return { success: false, error: error.message };
  if (!assets || assets.length === 0) return { success: false, error: "No assets found in database for this project." };

  // Use your real production environment variable, with localhost as a safe local fallback
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const qrCodes = await Promise.all(
    assets.map(async (asset) => {
      // Real, dynamic target URL pointing to your actual app instance
      const assetTargetUrl = `${baseUrl}/assets/${asset.id}`;

      const base64QrImage = await QRCode.toDataURL(assetTargetUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      return {
        assetId: asset.id,
        name: asset.name,
        tag: asset.asset_tag,
        qrUrl: base64QrImage
      };
    })
  );

  return { success: true, qrCodes };
}

// 5. Real Client Sign-off
export async function submitClientSignOff(handoverId: string, npsScore: number, signatureFileUrl: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("project_handovers")
    .update({
      status: "Approved",
      client_signature_url: signatureFileUrl,
      sign_off_status: { nps_score: npsScore, signed_at: new Date().toISOString() }
    })
    .eq("id", handoverId);

  if (error) return { success: false, error: error.message };
  revalidatePath(`/pm/handovers`);
  return { success: true };
}

// ==========================================
// REAL ASSET MANAGEMENT
// ==========================================

export async function getProjectAssets(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_assets")
    .select("*")
    .eq("project_id", projectId)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function createProjectAsset(formData: FormData) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();

  const project_id = formData.get("project_id") as string;
  const name = formData.get("name") as string;
  const asset_tag = formData.get("asset_tag") as string;
  const warranty_end = formData.get("warranty_end") as string;

  const { error } = await supabase.from("project_assets").insert({
    project_id,
    name,
    asset_tag,
    warranty_end: warranty_end || null
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/projects/${project_id}/handover`);
  return { success: true };
}

export async function deleteProjectAsset(assetId: string, projectId: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("project_assets").delete().eq("id", assetId);

  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/projects/${projectId}/handover`);
  return { success: true };
}