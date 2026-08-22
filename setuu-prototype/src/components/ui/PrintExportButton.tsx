"use client";

import { Download } from "lucide-react";

export function PrintExportButton() {
  const handlePrint = () => {
    // Inject a temporary print-specific style class to hide sidebars and nav
    // Most standard setups handle this via `@media print` in globals.css,
    // but triggering window.print() is the standard way to export a brief.
    window.print();
  };

  return (
    <button 
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 bg-surface border border-surface-variant/50 hover:bg-surface-variant/30 rounded-md font-semibold text-sm text-on-surface transition-colors whitespace-nowrap"
    >
      <Download className="w-4 h-4" />
      Executive Brief PDF
    </button>
  );
}
