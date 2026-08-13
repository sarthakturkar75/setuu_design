"use client";

import * as React from "react";
import { Search, Book, FileText, Cpu, Settings as SettingsIcon, Code2, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

const categories = [
  { id: "sops", name: "Standard Operating Procedures (SOPs)", icon: <FileText className="w-4 h-4" /> },
  { id: "hw", name: "Hardware Standards", icon: <Cpu className="w-4 h-4" /> },
  { id: "mech", name: "Mechanical Tolerances", icon: <SettingsIcon className="w-4 h-4" /> },
  { id: "sw", name: "Software Architecture", icon: <Code2 className="w-4 h-4" /> }
];

const mockDocs = [
  {
    id: "DOC-001",
    title: "CAN Bus Terminations & Topologies",
    category: "hw",
    author: "Ali Rahman",
    lastUpdated: "Aug 10, 2026",
    content: `
# CAN Bus Termination Guidelines

All physical CAN networks must be terminated with a 120Ω resistor at the physical ends of the bus to prevent signal reflection. 

## Best Practices
1. **Never** place termination resistors on intermediate nodes (stubs).
2. Use twisted pair cabling with an impedance of approximately 120Ω.
3. Keep stub lengths under 0.3 meters for 500kbps communication.

### EMI Mitigation
Ensure the CAN transceiver ground is isolated from the main logic ground if the node is exposed to high-voltage switching transients.
    `
  },
  {
    id: "DOC-002",
    title: "IP67 Enclosure Assembly SOP",
    category: "mech",
    author: "Robert Chen",
    lastUpdated: "Aug 12, 2026",
    content: "Content pending..."
  },
  {
    id: "DOC-003",
    title: "Firmware Flash Pipeline",
    category: "sw",
    author: "Jane Smith",
    lastUpdated: "Aug 01, 2026",
    content: "Content pending..."
  }
];

export default function DocsPage() {
  const [activeDoc, setActiveDoc] = React.useState(mockDocs[0]);
  const [activeCategory, setActiveCategory] = React.useState("hw");

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-surface overflow-hidden">
      
      {/* Left: Navigation */}
      <div className="w-80 border-r border-outline-variant bg-surface-container-lowest flex flex-col">
        <div className="p-6 pb-4 border-b border-outline-variant/50">
          <h2 className="font-merriweather font-bold text-xl text-on-surface flex items-center mb-4">
            <Book className="w-5 h-5 mr-2 text-primary" />
            Engineering Wiki
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search docs..." 
              className="w-full pl-9 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {categories.map(cat => (
            <div key={cat.id}>
              <h3 className="flex items-center text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-inter">
                <span className="mr-2 text-primary">{cat.icon}</span>
                {cat.name}
              </h3>
              <div className="space-y-1 pl-6 border-l-2 border-outline-variant/30 ml-2">
                {mockDocs.filter(d => d.category === cat.id).length === 0 ? (
                  <div className="text-xs text-on-surface-variant italic py-1">No documents</div>
                ) : (
                  mockDocs.filter(d => d.category === cat.id).map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setActiveDoc(doc);
                        setActiveCategory(cat.id);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeDoc.id === doc.id
                          ? "bg-primary/10 text-primary"
                          : "text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      {doc.title}
                    </button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Document Viewer */}
      <div className="flex-1 bg-surface-container-lowest overflow-y-auto">
        <div className="max-w-4xl mx-auto p-12">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm text-on-surface-variant font-inter mb-8">
            <Book className="w-4 h-4" />
            <span>Wiki</span>
            <ChevronRight className="w-4 h-4" />
            <span>{categories.find(c => c.id === activeCategory)?.name}</span>
          </div>

          {/* Doc Header */}
          <div className="mb-10 pb-6 border-b border-outline-variant/50">
            <h1 className="text-4xl font-merriweather font-bold text-on-surface mb-4 leading-tight">
              {activeDoc.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-on-surface-variant">
              <span className="bg-surface-container px-2 py-1 rounded border border-outline-variant/30 font-jetbrains-mono font-bold text-primary">
                {activeDoc.id}
              </span>
              <span>Last updated: {activeDoc.lastUpdated}</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span>Author: {activeDoc.author}</span>
            </div>
          </div>

          {/* Markdown Content */}
          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-merriweather prose-a:text-primary prose-pre:bg-surface-container-highest prose-pre:text-on-surface prose-pre:font-jetbrains-mono prose-pre:border prose-pre:border-outline-variant/30">
            <ReactMarkdown>{activeDoc.content}</ReactMarkdown>
          </article>
        </div>
      </div>

    </div>
  );
}
