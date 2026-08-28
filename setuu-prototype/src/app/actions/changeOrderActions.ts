"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyRole } from "./authUtils";
import { headers } from "next/headers";


// 1. Contingency Drawdown Tracking
export async function getContingencyMetrics(projectId: string) {
  const supabase = await createClient();
  
  // Get original contingency
  const { data: project } = await supabase
    .from("projects")
    .select("contingency_amount, contract_value")
    .eq("id", projectId)
    .single();

  const contingency = project?.contingency_amount || 0;
  const contractValue = project?.contract_value || 0;

  // Get approved changes
  const { data: changes } = await supabase
    .from("change_requests")
    .select("cost_impact")
    .eq("project_id", projectId)
    .eq("status", "Approved");

  const totalApprovedImpact = (changes || []).reduce((acc, curr) => acc + (curr.cost_impact || 0), 0);
  const remainingContingency = contingency - totalApprovedImpact;

  return {
    originalContingency: contingency,
    usedContingency: totalApprovedImpact,
    remainingContingency,
    contractValue,
    isOverdrawn: remainingContingency < 0
  };
}

// 2. Fetch changes with history and signatures
export async function getChangeRequests(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("change_requests")
    .select("*, change_requests_history(*), change_signatures(*)")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// 3. Submit Change Request with Markup Presets
export async function createChangeRequest(projectId: string, rawCost: number, title: string, description: string, timeImpactDays: number) {
  await verifyRole(["admin", "pm", "vendor"]);
  const supabase = await createClient();

  // Markup & Overhead Preset Algorithm
  const OVERHEAD_PERCENT = 0.15;
  const PROFIT_PERCENT = 0.05;
  const finalCostImpact = rawCost + (rawCost * OVERHEAD_PERCENT) + (rawCost * PROFIT_PERCENT);

  const { error } = await supabase.from("change_requests").insert({
    project_id: projectId,
    title,
    description,
    cost_impact: finalCostImpact,
    time_impact_days: timeImpactDays,
    status: "Draft", // Initial state
    custom_data: { 
      raw_cost: rawCost, 
      applied_markups: { overhead: "15%", profit: "5%" },
      approval_stage: "Vendor Proposed"
    }
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/projects/${projectId}/changes`);
  return { success: true };
}

// 4. Modify with Immutability (Audit Log)
export async function modifyChangeRequest(changeId: string, updates: any) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();

  // A. Fetch 'before' state
  const { data: beforeState } = await supabase
    .from("change_requests")
    .select("*")
    .eq("id", changeId)
    .single();

  if (!beforeState) return { success: false, error: "Change request not found" };

  // B. Snapshot it into history
  const { data: user } = await supabase.auth.getUser();
  await supabase.from("change_requests_history").insert({
    change_id: changeId,
    snapshot_data: beforeState,
    changed_by: user?.user?.id || 'system',
    changed_at: new Date().toISOString()
  });

  // C. Execute physical update
  const { error } = await supabase.from("change_requests").update(updates).eq("id", changeId);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/`);
  return { success: true };
}

// 5. Multi-Tier Workflow Engine
export async function advanceChangeWorkflow(changeId: string, signatureRole: string, currentStage: string) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  
  const STAGES = ["Vendor Proposed", "PM Recommended", "Admin Approved", "Client Signed"];
  const currentIndex = STAGES.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex >= STAGES.length - 1) {
    return { success: false, error: "Invalid or final stage." };
  }

  const nextStage = STAGES[currentIndex + 1];

  // Extract real IP Address
  const reqHeaders = await headers();
  const ipAddress = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip") || "Unknown IP";

  // Record Signature
  await supabase.from("change_signatures").insert({
    change_id: changeId,
    signer_id: user?.user?.id,
    role: signatureRole,
    signed_at: new Date().toISOString(),
    ip_address: ipAddress
  });

  // If Client signs, transition to physical 'Approved' status
  let physicalStatus = "Pending";
  if (nextStage === "Client Signed") physicalStatus = "Approved";
  
  // Advance stage
  await modifyChangeRequest(changeId, {
    status: physicalStatus,
    custom_data: { approval_stage: nextStage }
  });

  return { success: true, nextStage };
}

// 6. DocuSign E-Signature Prep
export async function sendForEsignature(changeId: string) {
  await verifyRole(["admin"]);
  const supabase = await createClient();

  const dsAccountId = process.env.DOCUSIGN_ACCOUNT_ID;
  const dsAccessToken = process.env.DOCUSIGN_ACCESS_TOKEN;

  if (!dsAccountId || !dsAccessToken) {
    return { success: false, error: "Missing DocuSign API credentials in environment variables." };
  }

  // A. Fetch physical Change Request data for document rendering
  const { data: change } = await supabase.from("change_requests").select("*").eq("id", changeId).single();
  if (!change) return { success: false, error: "Change Request not found" };
  
  // Find Client Contact
  let clientEmail = "";
  let clientName = "Client Representative";
  const { data: project } = await supabase.from("projects").select("client_org_id").eq("id", change.project_id).single();
  
  if (project?.client_org_id) {
    const { data: clientActor } = await supabase.from("user_actor")
      .select("id, display_name")
      .eq("organization_id", project.client_org_id)
      .eq("role", "client")
      .limit(1)
      .single();
      
    if (clientActor) {
      const { data: identity } = await supabase.from("user_identity").select("email").eq("actor_id", clientActor.id).single();
      if (identity?.email) {
        clientEmail = identity.email;
        clientName = clientActor.display_name || clientName;
      }
    }
  }

  if (!clientEmail) {
    return { success: false, error: "Could not find a valid client email for the project's organization." };
  }

  // B. Construct Real DocuSign Envelope Payload
  const envelopePayload = {
    emailSubject: `Please Sign: Variation Order - ${change.title}`,
    documents: [
      {
        documentBase64: Buffer.from(`Variation Order: ${change.title}\nCost Impact: $${change.cost_impact}\nTime Impact: ${change.time_impact_days} days\n\nSignature: ____________________`).toString('base64'),
        name: "Change_Order_Document.pdf",
        fileExtension: "pdf",
        documentId: "1"
      }
    ],
    recipients: {
      signers: [
        {
          email: clientEmail,
          name: clientName,
          recipientId: "1",
          routingOrder: "1",
          tabs: { signHereTabs: [{ anchorString: "Signature:", anchorXOffset: "100", anchorYOffset: "0", documentId: "1", pageNumber: "1" }] }
        }
      ]
    },
    status: "sent"
  };

  // C. Transmit to DocuSign API
  const dsResponse = await fetch(`https://demo.docusign.net/restapi/v2.1/accounts/${dsAccountId}/envelopes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${dsAccessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(envelopePayload)
  });

  if (!dsResponse.ok) {
    const errorData = await dsResponse.text();
    return { success: false, error: `DocuSign API Error: ${errorData}` };
  }

  const dsData = await dsResponse.json();
  const envelopeId = dsData.envelopeId;

  // D. Record the physical Envelope ID waiting for Webhook completion
  await supabase.from("change_signatures").insert({
    change_id: changeId,
    role: "Client API E-Signature",
    esign_envelope_id: envelopeId
  });

  return { success: true, message: "Envelope dispatched to DocuSign API successfully.", error: "" };
}
