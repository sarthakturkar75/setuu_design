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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const { data: actor } = await supabase.from('user_actor').select('role, id').eq('id', user.id).single();
        const role = actor?.role || 'engineer';
        
        if (role === 'client') {
            return NextResponse.json({ error: "Clients cannot export raw Excel data." }, { status: 403 });
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Setuu Enterprise PMIS";

        // Admin/PM get all sheets
        // Engineer gets Tracking, Issues, Tasks
        // Vendor gets Materials, Tasks
        const allowedSheets = {
            admin: ['Tasks', 'Tracking', 'Issues', 'Financials', 'PO', 'Invoices', 'Materials', 'SRS'],
            pm: ['Tasks', 'Tracking', 'Issues', 'Financials', 'PO', 'Invoices', 'Materials', 'SRS'],
            engineer: ['Tasks', 'Tracking', 'Issues'],
            vendor: ['Tasks', 'Materials']
        }[role as string] || [];

        // Example: Add Tasks sheet
        if (allowedSheets.includes('Tasks')) {
            let query = supabase.from("tasks").select("*").eq("project_id", projectId).order("created_at", { ascending: true });
            if (role === 'engineer') query = query.eq("assignee_id", actor?.id);
            if (role === 'vendor') query = query.eq("assignee_id", actor?.id); // Or vendor_id if tasks support it

            const { data: tasks } = await query;
            const worksheet = workbook.addWorksheet("Tasks");
            worksheet.columns = [
                { header: "Task ID", key: "display_id", width: 15 },
                { header: "Title", key: "title", width: 40 },
                { header: "Status", key: "status", width: 15 },
                { header: "UUID_ANCHOR", key: "id", width: 40, hidden: true }
            ];
            tasks?.forEach(t => worksheet.addRow(t));
        }

        if (allowedSheets.includes('Issues')) {
            const worksheet = workbook.addWorksheet("Issues");
            worksheet.columns = [{ header: "Title", key: "title", width: 40 }];
        }
        
        if (allowedSheets.includes('Tracking')) {
            const worksheet = workbook.addWorksheet("Tracking");
            worksheet.columns = [{ header: "Progress", key: "progress", width: 40 }];
        }

        if (allowedSheets.includes('Financials')) {
            const worksheet = workbook.addWorksheet("Financials");
            worksheet.columns = [{ header: "Contract Value", key: "value", width: 40 }];
        }

        if (allowedSheets.includes('PO')) {
            const worksheet = workbook.addWorksheet("PO");
            worksheet.columns = [{ header: "PO Number", key: "po", width: 40 }];
        }

        if (allowedSheets.includes('Invoices')) {
            const worksheet = workbook.addWorksheet("Invoices");
            worksheet.columns = [{ header: "Invoice Number", key: "inv", width: 40 }];
        }

        if (allowedSheets.includes('Materials')) {
            let query = supabase.from("project_materials").select("*").eq("project_id", projectId);
            if (role === 'vendor') query = query.eq("vendor_id", actor?.id);
            const { data: materials } = await query;
            const worksheet = workbook.addWorksheet("Materials");
            worksheet.columns = [{ header: "Material", key: "name", width: 40 }];
            materials?.forEach(m => worksheet.addRow(m));
        }

        if (allowedSheets.includes('SRS')) {
            const worksheet = workbook.addWorksheet("SRS");
            worksheet.columns = [{ header: "Requirement", key: "title", width: 40 }];
        }

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
