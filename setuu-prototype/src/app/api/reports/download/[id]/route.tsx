import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { renderToStream } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import React from 'react';

// Define styles
const styles = StyleSheet.create({
  page: { flexDirection: 'column', padding: 30 },
  section: { margin: 10, padding: 10 },
  title: { fontSize: 24, marginBottom: 10, fontWeight: 'bold' },
  subtitle: { fontSize: 18, marginBottom: 5, color: '#333' },
  text: { fontSize: 12, marginBottom: 5, color: '#666' },
  table: { display: "flex", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableColHeader: { width: "50%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#eee' },
  tableCol: { width: "50%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCell: { margin: "auto", marginTop: 5, fontSize: 10, padding: 5 }
});

// PDF Component
const ProjectReportPDF = ({ project }: { project: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Project Report: {project.name}</Text>
        <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>Project Overview</Text>
        <Text style={styles.text}>Status: {project.status}</Text>
        <Text style={styles.text}>Description: {project.description}</Text>
        <Text style={styles.text}>Created At: {new Date(project.created_at).toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Key Milestones</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text style={styles.tableCell}>Milestone</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCell}>Status</Text></View>
          </View>
          {(project.milestones || []).map((m: any) => (
            <View style={styles.tableRow} key={m.id}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{m.title}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{m.status}</Text></View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const projectId = params.id;
  
  const supabase = await createServiceRoleClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("*, milestones(id, title, status)")
    .eq("id", projectId)
    .single();

  if (error || !project) {
    return new NextResponse("Project not found", { status: 404 });
  }

  try {
    const stream = await renderToStream(<ProjectReportPDF project={project} />);
    
    // We need to convert Node.js stream to Web ReadableStream
    const readable = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      }
    });

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="project-report-${projectId}.pdf"`
      }
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return new NextResponse("Error generating PDF", { status: 500 });
  }
}
