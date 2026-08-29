import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  renderToStream,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { flexDirection: "column", padding: 30, backgroundColor: "#ffffff" },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#1a1a1a",
    fontWeight: "bold",
  },
  section: { margin: 10, padding: 10, borderBottom: "1pt solid #eeeeee" },
  title: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333333",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: { fontSize: 12, color: "#666666" },
  value: { fontSize: 12, color: "#1a1a1a" },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: { margin: "auto", marginTop: 5, fontSize: 10 },
});

const ProjectReport = ({ project }: { project: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>{project.name} - Executive Report</Text>

      <View style={styles.section}>
        <Text style={styles.title}>Project Overview</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{project.status}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Contract Value:</Text>
          <Text style={styles.value}>
            ${(project.contract_value || 0).toLocaleString()}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>
            {new Date(project.planned_start_date).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Milestones</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Name</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Target Date</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Status</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Progress</Text>
            </View>
          </View>
          {(project.milestones || []).map((m: any) => (
            <View style={styles.tableRow} key={m.id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{m.name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {new Date(m.target_date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{m.status}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{m.progress || 0}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 30,
          left: 30,
          right: 30,
          textAlign: "center",
        }}
      >
        <Text style={{ fontSize: 10, color: "#999999" }}>
          Generated securely by Setuu PMIS • {new Date().toLocaleString()}
        </Text>
      </View>
    </Page>
  </Document>
);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Extract project ID (strip .pdf if present)
    const { id } = await context.params;
    const projectId = id.replace("project-", "").replace(".pdf", "");

    const { data: project, error } = await supabase
      .from("projects")
      .select("*, milestones(*), project_materials(*)")
      .eq("id", projectId)
      .single();

    if (error || !project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    const stream = await renderToStream(<ProjectReport project={project} />);

    // Convert stream to readable web stream
    const readable = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="project-${projectId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
