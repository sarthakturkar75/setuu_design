const fs = require('fs');

const code = `import { createClient } from "@/lib/supabase/server";
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const { data: actor } = await supabase.from('user_actor').select('role, id').eq('id', user.id).single();
        const role = actor?.role || 'engineer';
        
        if (role === 'client') {
            return NextResponse.json({ error: "Clients cannot export raw Excel data." }, { status: 403 });
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Setuu Enterprise PMIS";

        const allowedSheets = {
            admin: ['Tasks', 'Tracking', 'Issues', 'Financials', 'PO', 'Invoices', 'Materials', 'SRS'],
            pm: ['Tasks', 'Tracking', 'Issues', 'Financials', 'PO', 'Invoices', 'Materials', 'SRS'],
            engineer: ['Tasks', 'Tracking', 'Issues'],
            vendor: ['Tasks', 'Materials']
        }[role] || [];

        // Planning (Tasks)
        if (allowedSheets.includes('Tasks')) {
            let query = supabase.from("tasks").select("*").eq("project_id", projectId).order("created_at", { ascending: true });
            if (role === 'engineer') query = query.eq("assignee_id", actor?.id);
            if (role === 'vendor') query = query.eq("assignee_id", actor?.id); 
            const { data: tasks } = await query;
            const worksheet = workbook.addWorksheet("Planning");
            worksheet.columns = [
                { header: "Task ID", key: "display_id", width: 15 },
                { header: "Title", key: "title", width: 40 },
                { header: "Status", key: "status", width: 15 },
                { header: "UUID_ANCHOR", key: "id", width: 40, hidden: true }
            ];
            tasks?.forEach(t => worksheet.addRow(t));
        }

        // Issues
        if (allowedSheets.includes('Issues')) {
            const { data: issues } = await supabase.from("project_issues").select("*").eq("project_id", projectId);
            const worksheet = workbook.addWorksheet("Issues");
            worksheet.columns = [
                { header: "Issue Title", key: "title", width: 40 },
                { header: "Status", key: "status", width: 15 },
                { header: "Severity", key: "severity", width: 15 },
                { header: "ID", key: "id", width: 40, hidden: true }
            ];
            issues?.forEach(i => worksheet.addRow(i));
        }
        
        // Tracking (Daily Logs)
        if (allowedSheets.includes('Tracking')) {
            const { data: logs } = await supabase.from("daily_logs").select("*").eq("project_id", projectId);
            const worksheet = workbook.addWorksheet("Tracking");
            worksheet.columns = [
                { header: "Date", key: "log_date", width: 20 },
                { header: "Notes", key: "notes", width: 60 },
                { header: "ID", key: "id", width: 40, hidden: true }
            ];
            logs?.forEach(l => worksheet.addRow(l));
        }

        // Financials (Change Requests)
        if (allowedSheets.includes('Financials')) {
            const { data: changes } = await supabase.from("change_requests").select("*").eq("project_id", projectId);
            const worksheet = workbook.addWorksheet("Financials");
            worksheet.columns = [
                { header: "Title", key: "title", width: 40 },
                { header: "Amount", key: "cost_impact", width: 20 },
                { header: "Status", key: "status", width: 15 },
                { header: "ID", key: "id", width: 40, hidden: true }
            ];
            changes?.forEach(c => worksheet.addRow(c));
        }

        // Purchase Orders
        if (allowedSheets.includes('PO')) {
            const { data: pos } = await supabase.from("purchase_orders").select("*").eq("project_id", projectId);
            const worksheet = workbook.addWorksheet("PO");
            worksheet.columns = [
                { header: "PO Number", key: "po_number", width: 20 },
                { header: "Amount", key: "amount", width: 20 },
                { header: "Status", key: "status", width: 15 },
                { header: "ID", key: "id", width: 40, hidden: true }
            ];
            pos?.forEach(p => worksheet.addRow(p));
        }

        // Invoices
        if (allowedSheets.includes('Invoices')) {
            const { data: invs } = await supabase.from("invoices").select("*").eq("project_id", projectId);
            const worksheet = workbook.addWorksheet("Invoices");
            worksheet.columns = [
                { header: "Invoice Number", key: "invoice_number", width: 20 },
                { header: "Amount", key: "amount", width: 20 },
                { header: "Status", key: "status", width: 15 },
                { header: "ID", key: "id", width: 40, hidden: true }
            ];
            invs?.forEach(i => worksheet.addRow(i));
        }

        // Materials
        if (allowedSheets.includes('Materials')) {
            let query = supabase.from("project_materials").select("*").eq("project_id", projectId);
            if (role === 'vendor') query = query.eq("vendor_id", actor?.id);
            const { data: materials } = await query;
            const worksheet = workbook.addWorksheet("Materials");
            worksheet.columns = [
                { header: "Material Name", key: "item_name", width: 40 },
                { header: "Quantity", key: "quantity_ordered", width: 15 },
                { header: "Status", key: "status", width: 15 },
                { header: "ID", key: "id", width: 40, hidden: true }
            ];
            materials?.forEach(m => worksheet.addRow(m));
        }

        // SRS
        if (allowedSheets.includes('SRS')) {
            const { data: srs } = await supabase.from("project_requirements").select("*").eq("project_id", projectId);
            const worksheet = workbook.addWorksheet("SRS");
            worksheet.columns = [
                { header: "Requirement", key: "title", width: 40 },
                { header: "Status", key: "status", width: 15 },
                { header: "Priority", key: "priority", width: 15 },
                { header: "ID", key: "id", width: 40, hidden: true }
            ];
            srs?.forEach(s => worksheet.addRow(s));
        }

        const buffer = await workbook.xlsx.writeBuffer();
        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": \`attachment; filename="Setuu_Export_\${projectId.substring(0, 6)}.xlsx"\`
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
`;

fs.writeFileSync('src/app/api/sync/export/route.ts', code);
