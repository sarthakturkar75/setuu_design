import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

// Helper to reliably parse Excel Serial Dates into UTC Postgres Strings
const parseExcelDate = (val: any) => {
    if (!val) return null;
    // If ExcelJS parsed it as a native JS Date object
    if (val instanceof Date) {
        // Subtract the timezone offset to force strict UTC alignment
        const utcDate = new Date(val.getTime() - (val.getTimezoneOffset() * 60000));
        return utcDate.toISOString().split('T')[0];
    }
    // Fallback for raw string formats
    try {
        return new Date(val).toISOString().split('T')[0];
    } catch (e) {
        return null;
    }
};

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const projectId = formData.get("projectId") as string;

        if (!file || !projectId) {
            return NextResponse.json({ error: "Missing file or projectId" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // 1. Read the uploaded file buffer into ExcelJS
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const workbook = new ExcelJS.Workbook();

        // Use 'as any' to bypass the strict TypeScript interface mismatch. 
        // At runtime, ExcelJS processes this buffer perfectly.
        await workbook.xlsx.load(buffer as any);

        const worksheet = workbook.getWorksheet("Planning");
        if (!worksheet) {
            return NextResponse.json({ error: "Invalid format. 'Planning' worksheet missing." }, { status: 400 });
        }

        let updatedCount = 0;
        let insertedCount = 0;
        const recordsToProcess: any[] = [];

        // 2. Iterate through rows and extract data
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip Header Row

            const title = row.getCell(2).value?.toString();
            if (!title) return; // Title (Activity) is mandatory. Skip empty rows.

            const display_id = row.getCell(1).value?.toString() || null;
            const department = row.getCell(3).value?.toString() || 'General';
            const planned_start_date = parseExcelDate(row.getCell(4).value);
            const planned_finish_date = parseExcelDate(row.getCell(5).value);
            const duration_days = parseInt(row.getCell(6).value?.toString() || '0') || null;
            const priority = row.getCell(7).value?.toString() || 'Medium';
            const status = row.getCell(8).value?.toString() || 'Not Started';
            const actual_percent_complete = parseInt(row.getCell(9).value?.toString() || '0') || 0;
            const remarks = row.getCell(10).value?.toString() || null;

            // Extract the Hidden UUID Anchor
            const uuid_anchor = row.getCell(11).value?.toString();

            recordsToProcess.push({
                uuid_anchor, // Temporary tracking property
                payload: {
                    project_id: projectId,
                    display_id,
                    title,
                    department,
                    planned_start_date,
                    planned_finish_date,
                    duration_days,
                    priority,
                    status,
                    actual_percent_complete,
                    remarks
                }
            });
        });

        // 3. The UPSERT Execution Router
        for (const record of recordsToProcess) {
            if (record.uuid_anchor && record.uuid_anchor !== 'undefined') {
                // SCENARIO A: UUID Exists -> Safe UPDATE
                const { error } = await supabase
                    .from("tasks")
                    .update(record.payload)
                    .eq("id", record.uuid_anchor)
                    .eq("project_id", projectId); // Security safety net

                if (!error) updatedCount++;
                else console.error(`Failed to update Task ${record.uuid_anchor}:`, error.message);
            } else {
                // SCENARIO B: No UUID -> PM manually added a net-new row in Excel -> INSERT
                record.payload.created_by = user.id; // Schema requirement

                const { error } = await supabase
                    .from("tasks")
                    .insert(record.payload);

                if (!error) insertedCount++;
                else console.error("Failed to insert new task:", error.message);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Sync Complete. ${updatedCount} rows updated. ${insertedCount} new rows inserted.`,
            metrics: { updatedCount, insertedCount }
        });

    } catch (error: any) {
        console.error("Excel Import Error:", error);
        return NextResponse.json({ error: error.message || "Failed to process Excel file" }, { status: 500 });
    }
}