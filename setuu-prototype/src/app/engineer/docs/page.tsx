"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getTeamDocuments } from "@/app/actions/teamDocActions";
import { useAuth } from "@/contexts/AuthContext";

export default function EngineerDocs() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getTeamDocuments();
      setDocs(data || []);
      if (data && data.length > 0) setSelectedDoc(data[0]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col space-y-6">
      <PageHeader title="Team Wiki & Docs" subtitle="Standards, SOPs, and project documentation." />
      
      <div className="flex flex-1 gap-6 min-h-[500px]">
        {/* Left Panel: Tree */}
        <Card className="w-1/3 p-4 overflow-y-auto flex flex-col">
          <h3 className="font-bold mb-4 text-on-surface">Categories</h3>
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-surface-variant rounded w-3/4"></div>
              <div className="h-4 bg-surface-variant rounded w-1/2"></div>
            </div>
          ) : (
            <div className="space-y-2 flex-1">
              {docs.length === 0 && <p className="text-sm text-on-surface-variant">No documents available.</p>}
              {docs.map(doc => (
                <div 
                  key={doc.id} 
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-2 rounded cursor-pointer text-sm font-medium transition-colors ${selectedDoc?.id === doc.id ? 'bg-primary text-white' : 'hover:bg-surface-variant text-on-surface'}`}
                >
                  {doc.title}
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" className="mt-4 w-full">New Document</Button>
        </Card>

        {/* Right Panel: Viewer */}
        <Card className="flex-1 p-6 overflow-y-auto">
          {selectedDoc ? (
            <div className="space-y-4">
              <div className="border-b border-outline-variant/30 pb-4 mb-4">
                <h2 className="text-2xl font-bold text-on-surface">{selectedDoc.title}</h2>
                <div className="text-sm text-on-surface-variant flex gap-4 mt-2">
                  <span>Category: <span className="capitalize font-medium">{selectedDoc.category || 'General'}</span></span>
                  <span>Updated: {new Date(selectedDoc.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none text-on-surface">
                {/* Normally we'd use react-markdown, simulating here */}
                {selectedDoc.content.split('\n').map((para: string, idx: number) => (
                  <p key={idx} className="mb-2">{para}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-on-surface-variant">
              Select a document to view
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
