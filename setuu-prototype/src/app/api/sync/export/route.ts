import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");

        if (!projectId) {
            return NextResponse.json({ error: "Missing projectId parameter" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const { data: actor } = await supabase.from('user_actor').select('role, id').eq('id', user.id).single();
        const role = actor?.role || 'engineer';
        
        if (role === 'client') {
            return NextResponse.json({ error: "Clients cannot export raw Excel data." }, { status: 403 });
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Setuu Enterprise PMIS";

        // Planning (Projects)
        const { data: projects } = await supabase.from("projects").select("*").eq("id", projectId);
        const planningSheet = workbook.addWorksheet("Planning");
        planningSheet.columns = [
            { header: "Project ID", key: "id", width: 40 },
            { header: "Project Name", key: "name", width: 40 },
            { header: "Status", key: "status", width: 15 },
        ];
        projects?.forEach(p => planningSheet.addRow(p));

        // Tracking (Project Milestones)
        const { data: milestones } = await supabase.from("project_milestones").select("*").eq("project_id", projectId);
        const trackingSheet = workbook.addWorksheet("Tracking");
        trackingSheet.columns = [
            { header: "Milestone Name", key: "title", width: 40 },
            { header: "Status", key: "status", width: 15 },
            { header: "Due Date", key: "due_date", width: 20 },
            { header: "ID", key: "id", width: 40, hidden: true }
        ];
        milestones?.forEach(m => trackingSheet.addRow(m));

        // Issues
        const { data: issues } = await supabase.from("project_issues").select("*").eq("project_id", projectId);
        const issuesSheet = workbook.addWorksheet("Issues");
        issuesSheet.columns = [
            { header: "Issue Title", key: "title", width: 40 },
            { header: "Status", key: "status", width: 15 },
            { header: "Severity", key: "severity", width: 15 },
            { header: "ID", key: "id", width: 40, hidden: true }
        ];
        issues?.forEach(i => issuesSheet.addRow(i));

        // Financials (Change Requests)
        const { data: changes } = await supabase.from("change_requests").select("*").eq("project_id", projectId);
        const financialsSheet = workbook.addWorksheet("Financials");
        financialsSheet.columns = [
            { header: "Title", key: "title", width: 40 },
            { header: "Amount", key: "cost_impact", width: 20 },
            { header: "Status", key: "status", width: 15 },
            { header: "ID", key: "id", width: 40, hidden: true }
        ];
        changes?.forEach(c => financialsSheet.addRow(c));

        // PO (Purchase Orders)
        const { data: pos } = await supabase.from("purchase_orders").select("*").eq("project_id", projectId);
        const poSheet = workbook.addWorksheet("PO");
        poSheet.columns = [
            { header: "PO Number", key: "po_number", width: 20 },
            { header: "Amount", key: "amount", width: 20 },
            { header: "Status", key: "status", width: 15 },
            { header: "ID", key: "id", width: 40, hidden: true }
        ];
        pos?.forEach(p => poSheet.addRow(p));

        // Invoices
        const { data: invs } = await supabase.from("invoices").select("*").eq("project_id", projectId);
        const invoicesSheet = workbook.addWorksheet("Invoices");
        invoicesSheet.columns = [
            { header: "Invoice Number", key: "invoice_number", width: 20 },
            { header: "Amount", key: "amount", width: 20 },
            { header: "Status", key: "status", width: 15 },
            { header: "ID", key: "id", width: 40, hidden: true }
        ];
        invs?.forEach(i => invoicesSheet.addRow(i));

        // SRS (Project Materials)
        const { data: materials } = await supabase.from("project_materials").select("*").eq("project_id", projectId);
        const srsSheet = workbook.addWorksheet("SRS");
        srsSheet.columns = [
            { header: "Material Name", key: "item_name", width: 40 },
            { header: "Quantity", key: "quantity_ordered", width: 15 },
            { header: "Status", key: "status", width: 15 },
            { header: "ID", key: "id", width: 40, hidden: true }
        ];
        materials?.forEach(m => srsSheet.addRow(m));

        const buffer = await workbook.xlsx.writeBuffer();
        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="Setuu_Export_${projectId.substring(0, 6)}.xlsx"`
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
