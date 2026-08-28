import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

const parseExcelDate = (val: any) => {
    if (!val) return null;
    if (val instanceof Date) {
        const utcDate = new Date(val.getTime() - val.getTimezoneOffset() * 60000);
        return utcDate.toISOString().split("T")[0];
    }
    try {
        return new Date(val).toISOString().split("T")[0];
    } catch (e) {
        return null;
    }
};

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const projectId = formData.get("projectId") as string;

        if (!file || !projectId)
            return NextResponse.json({ error: "Missing payload" }, { status: 400 });

        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data: actor } = await supabase.from('user_actor').select('role, id').eq('id', user.id).single();
        const role = actor?.role || 'engineer';


        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer as any);

        let updatedCount = 0;
        let insertedCount = 0;

        // ==========================================
        // IMPORT ROUTER: Check which sheet exists
        // ==========================================
        const planningSheet = workbook.getWorksheet("Planning");
        const srsSheet = workbook.getWorksheet("SRS");

        if (srsSheet) {
            if (role === 'engineer') return NextResponse.json({ error: "Engineers cannot modify SRS matrix" }, { status: 403 });
            // PROCESS SRS MATRIX
            for (let rowNumber = 2; rowNumber <= srsSheet.rowCount; rowNumber++) {
                const row = srsSheet.getRow(rowNumber);
                const title = row.getCell(2).value?.toString();
                if (!title) continue;

                const payload = {
                    project_id: projectId,
                    display_id: row.getCell(1).value?.toString() || null,
                    title,
                    category: row.getCell(3).value?.toString() || null,
                    specification_value: row.getCell(4).value?.toString() || null,
                    customer_requirement: row.getCell(5).value?.toString() || null,
                    priority: row.getCell(6).value?.toString() || "Medium",
                    source_document: row.getCell(7).value?.toString() || null,
                    status: row.getCell(8).value?.toString() || "Draft",
                    remarks: row.getCell(9).value?.toString() || null,
                };

                const uuid_anchor = row.getCell(10).value?.toString(); // Column J

                if (uuid_anchor && uuid_anchor !== "undefined") {
                    const { error } = await supabase
                        .from("project_requirements")
                        .update(payload)
                        .eq("id", uuid_anchor)
                        .eq("project_id", projectId);
                    if (!error) updatedCount++;
                } else {
                    const { error } = await supabase
                        .from("project_requirements")
                        .insert(payload);
                    if (!error) insertedCount++;
                }
            }
        } else if (planningSheet) {
            // PROCESS PLANNING MATRIX (TASKS)
            for (
                let rowNumber = 2;
                rowNumber <= planningSheet.rowCount;
                rowNumber++
            ) {
                const row = planningSheet.getRow(rowNumber);
                const title = row.getCell(2).value?.toString();
                if (!title) continue;

                const payload = {
                    project_id: projectId,
                    display_id: row.getCell(1).value?.toString() || null,
                    title,
                    department: row.getCell(3).value?.toString() || "General",
                    planned_start_date: parseExcelDate(row.getCell(4).value),
                    planned_finish_date: parseExcelDate(row.getCell(5).value),
                    duration_days:
                        parseInt(row.getCell(6).value?.toString() || "0") || null,
                    priority: row.getCell(7).value?.toString() || "Medium",
                    status: row.getCell(8).value?.toString() || "Not Started",
                    actual_percent_complete:
                        parseInt(row.getCell(9).value?.toString() || "0") || 0,
                    remarks: row.getCell(10).value?.toString() || null,
                };

                const uuid_anchor = row.getCell(11).value?.toString(); // Column K

                if (uuid_anchor && uuid_anchor !== "undefined") {
                    if (role === 'engineer') {
                        // Check if they own it
                        const { data: existing } = await supabase.from('tasks').select('assignee_id').eq('id', uuid_anchor).single();
                        if (existing?.assignee_id !== actor?.id) continue; // Skip rows they don't own
                    }
                    const { error } = await supabase
                        .from("tasks")
                        .update(payload)
                        .eq("id", uuid_anchor)
                        .eq("project_id", projectId);
                    if (!error) updatedCount++;
                } else {
                    (payload as any).created_by = user.id;
                    const { error } = await supabase.from("tasks").insert(payload);
                    if (!error) insertedCount++;
                }
            }
        } else {
            return NextResponse.json(
                {
                    error:
                        "Invalid Excel format. Must contain a sheet named 'Planning' or 'SRS'",
                },
                { status: 400 },
            );
        }

        return NextResponse.json({
            success: true,
            message: `Sync Complete: ${updatedCount} updated, ${insertedCount} inserted.`,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
