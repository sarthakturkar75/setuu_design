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

        // 1. Fetch live deterministic task data from Supabase
        const { data: tasks, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("project_id", projectId)
            .order("created_at", { ascending: true });

        if (error) throw new Error(error.message);

        // 2. Initialize ExcelJS Workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Setuu Enterprise PMIS";
        const worksheet = workbook.addWorksheet("Planning", {
            properties: { tabColor: { argb: 'FF0052CC' } } // Setuu Primary Color
        });

        // 3. Define Columns matching the PM's Tracking Sheet perfectly
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
            // THE ANCHOR: Hidden Column K containing the Supabase UUID
            { header: "UUID_ANCHOR", key: "id", width: 40, hidden: true }
        ];

        // Style the Header Row
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };

        // 4. Inject Database Rows
        tasks?.forEach(task => {
            worksheet.addRow({
                display_id: task.display_id,
                title: task.title,
                department: task.department || 'General',
                planned_start_date: task.planned_start_date ? new Date(task.planned_start_date) : '',
                planned_finish_date: task.planned_finish_date ? new Date(task.planned_finish_date) : '',
                duration_days: task.duration_days,
                priority: task.priority || 'Medium',
                status: task.status || 'Not Started',
                actual_percent_complete: task.actual_percent_complete || 0,
                remarks: task.remarks,
                id: task.id // Injected invisibly
            });
        });

        // 5. Apply Data Validation Dropdowns & Cell Locking
        // We apply this to rows 2 through 1000 to cover future manual additions by the PM
        for (let i = 2; i <= 1000; i++) {
            // Priority Dropdown (Column G)
            worksheet.getCell(`G${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: ['"Low,Medium,High,Critical"']
            };

            // Status Dropdown (Column H)
            worksheet.getCell(`H${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: ['"Not Started,In Progress,On Hold,Completed,Delivered"']
            };

            // Ensure all standard cells remain editable
            worksheet.getRow(i).eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (colNumber === 11) { // Column K (UUID_ANCHOR)
                    cell.protection = { locked: true };
                } else {
                    cell.protection = { locked: false };
                }
            });
        }

        // Protect the worksheet structure so the UUID column cannot be unhidden or deleted
        await worksheet.protect('setuu-admin-lock-2026', {
            selectLockedCells: false,
            selectUnlockedCells: true,
            formatColumns: true,
            formatRows: true,
            insertRows: true
        });

        // 6. Generate Buffer and Return as Download
        const buffer = await workbook.xlsx.writeBuffer();

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="Setuu_Planning_Sync_${projectId}.xlsx"`
            }
        });

    } catch (error: any) {
        console.error("Excel Export Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}