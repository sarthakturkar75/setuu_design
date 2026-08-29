import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jsPDF } from "jspdf";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  
  if (!projectId) {
    return new Response("Missing projectId", { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  
  // 1. Fetch Project
  const { data: project } = await supabase.from("projects").select("*").eq("id", projectId).single();
  
  // 2. Fetch all completed cost-loaded milestones
  const { data: milestones } = await supabase
    .from("milestones")
    .select("*")
    .eq("project_id", projectId)
    .not("sov_value", "is", null);

  if (!project || !milestones) {
    return new Response("No data found", { status: 404 });
  }

  const { data: changeOrders } = await supabase
    .from("change_requests")
    .select("cost_impact")
    .eq("project_id", projectId)
    .eq("status", "Approved");
  
  const netChangeByCO = changeOrders?.reduce((acc, co) => acc + (co.cost_impact || 0), 0) || 0;

  // Calculate AIA G702 metrics
  const originalContractSum = project.contract_value || 0;
  
  const completedMilestones = milestones.filter(m => m.completion_status === true || m.custom_data?.kanban_status === 'completed');
  const totalCompletedValue = completedMilestones.reduce((acc, m) => acc + (m.sov_value || 0), 0);
  const retainage = totalCompletedValue * 0.10; // 10% retainage
  const totalEarnedLessRetainage = totalCompletedValue - retainage;

  // 3. Generate PDF
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("AIA Document G702 - Application and Certificate for Payment", 14, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`PROJECT: ${project.name}`, 14, 30);
  doc.text(`APPLICATION NO: ${new Date().getTime().toString().slice(-6)}`, 140, 30);
  doc.text(`APPLICATION DATE: ${new Date().toISOString().split('T')[0]}`, 140, 35);
  doc.text(`PERIOD TO: ${new Date().toISOString().split('T')[0]}`, 140, 40);

  doc.setFont("helvetica", "bold");
  doc.text("CONTRACTOR'S APPLICATION FOR PAYMENT", 14, 55);
  
  doc.setFont("helvetica", "normal");
  const leftCol = 14;
  const rightCol = 150;
  
  let y = 65;
  doc.text("1. ORIGINAL CONTRACT SUM", leftCol, y);
  doc.text(`$${originalContractSum.toLocaleString()}`, rightCol, y);
  
  y += 10;
  doc.text("2. Net change by Change Orders", leftCol, y);
  doc.text(`${netChangeByCO.toLocaleString()}`, rightCol, y);
  
  y += 10;
  doc.text("3. CONTRACT SUM TO DATE (Line 1 + 2)", leftCol, y);
  doc.text(`${(originalContractSum + netChangeByCO).toLocaleString()}`, rightCol, y);
  
  y += 10;
  doc.text("4. TOTAL COMPLETED & STORED TO DATE", leftCol, y);
  doc.text(`$${totalCompletedValue.toLocaleString()}`, rightCol, y);
  
  y += 10;
  doc.text("5. RETAINAGE (10%)", leftCol, y);
  doc.text(`$${retainage.toLocaleString()}`, rightCol, y);
  
  y += 10;
  doc.text("6. TOTAL EARNED LESS RETAINAGE (Line 4 - 5)", leftCol, y);
  doc.text(`$${totalEarnedLessRetainage.toLocaleString()}`, rightCol, y);
  
  y += 20;
  doc.setFontSize(8);
  doc.text("The undersigned Contractor certifies that to the best of the Contractor's knowledge, information and belief the Work", 14, y);
  doc.text("covered by this Application for Payment has been completed in accordance with the Contract Documents...", 14, y+5);
  
  y += 20;
  doc.line(14, y, 100, y);
  doc.text("CONTRACTOR SIGNATURE", 14, y+5);
  
  // Output PDF as ArrayBuffer
  const pdfOutput = doc.output("arraybuffer");
  
  return new Response(pdfOutput, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="AIA_G702_${project.name.replace(/\s+/g, '_')}.pdf"`
    }
  });
}
