import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");
        const exportType = searchParams.get("type") || "planning"; // default to planning for backward compatibility

        if (!projectId) {
            return NextResponse.json({ error: "Missing projectId parameter" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const { data: actor } = await supabase.from('user_actor').select('role, id').eq('id', user.id).single();
        const role = actor?.role || 'engineer';
        
        const isPlanningRestricted = role === 'engineer' && exportType !== 'srs';
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Setuu Enterprise PMIS";

        if (exportType === "srs") {
            // ==========================================
            // EXPORT: SRS MATRIX
            // ==========================================
            const { data: reqs, error } = await supabase
                .from("project_requirements")
                .select("*")
                .eq("project_id", projectId)
                .order("created_at", { ascending: true });

            if (error) throw new Error(error.message);

            const worksheet = workbook.addWorksheet("SRS", { properties: { tabColor: { argb: 'FF00B0FF' } } });

            worksheet.columns = [
                { header: "SRS ID", key: "display_id", width: 15 },
                { header: "Requirement", key: "title", width: 40 },
                { header: "Category", key: "category", width: 20 },
                { header: "Specification", key: "specification_value", width: 30 },
                { header: "Customer Requirement", key: "customer_requirement", width: 40 },
                { header: "Priority", key: "priority", width: 15 },
                { header: "Source", key: "source_document", width: 20 },
                { header: "Status", key: "status", width: 15 },
                { header: "Remarks", key: "remarks", width: 40 },
                { header: "UUID_ANCHOR", key: "id", width: 40, hidden: true } // Column J
            ];

            worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };

            reqs?.forEach(r => worksheet.addRow({
                display_id: r.display_id, title: r.title, category: r.category,
                specification_value: r.specification_value, customer_requirement: r.customer_requirement,
                priority: r.priority || 'Medium', status: r.status || 'Draft',
                source_document: r.source_document, remarks: r.remarks, id: r.id
            }));

            // Cell Locking
            for (let i = 2; i <= 500; i++) {
                worksheet.getCell(`F${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Low,Medium,High,Critical"'] };
                worksheet.getRow(i).eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    cell.protection = { locked: colNumber === 10 }; // Lock only UUID
                });
            }
            await worksheet.protect('setuu-admin', { selectUnlockedCells: true, formatColumns: true, formatRows: true, insertRows: true });

        } else {
            // ==========================================
            // EXPORT: PLANNING MATRIX (TASKS)
            // ==========================================
            let query = supabase.from("tasks").select("*").eq("project_id", projectId).order("created_at", { ascending: true });
            if (isPlanningRestricted) {
                query = query.eq("assignee_id", actor?.id);
            }
            const { data: tasks, error } = await query;

            if (error) throw new Error(error.message);

            const worksheet = workbook.addWorksheet("Planning", { properties: { tabColor: { argb: 'FF0052CC' } } });
            worksheet.columns = [
                { header: "Task ID", key: "display_id", width: 15 },
                { header: "Activity", key: "title", width: 40 },
                { header: "Department", key: "department", width: 20 },
                { header: "Planned Start", key: "planned_start_date", width: 18 },
                { header: "Planned Finish", key: "planned_finish_date", width: 18 },
                { header: "Duration (Days)", key: "duration_days", width: 15 },
                { header: "Priority", key: "priority", width: 15 },
                { header: "Status", key: "status", width: 15 },
                { header: "% Complete", key: "actual_percent_complete", width: 15 },
                { header: "Remarks", key: "remarks", width: 50 },
                { header: "UUID_ANCHOR", key: "id", width: 40, hidden: true } // Column K
            ];

            worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };

            tasks?.forEach(t => worksheet.addRow({
                display_id: t.display_id, title: t.title, department: t.department || 'General',
                planned_start_date: t.planned_start_date ? new Date(t.planned_start_date) : '',
                planned_finish_date: t.planned_finish_date ? new Date(t.planned_finish_date) : '',
                duration_days: t.duration_days, priority: t.priority || 'Medium', status: t.status || 'Not Started',
                actual_percent_complete: t.actual_percent_complete || 0, remarks: t.remarks, id: t.id
            }));

            // Cell Locking
            for (let i = 2; i <= 500; i++) {
                worksheet.getCell(`G${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Low,Medium,High,Critical"'] };
                worksheet.getRow(i).eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    cell.protection = { locked: colNumber === 11 }; // Lock only UUID
                });
            }
            await worksheet.protect('setuu-admin', { selectUnlockedCells: true, formatColumns: true, formatRows: true, insertRows: true });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="Setuu_${exportType.toUpperCase()}_Sync_${projectId.substring(0, 6)}.xlsx"`
            }
        });
    } catch (error: any) {
        console.error("Excel Export Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}