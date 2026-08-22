"use client";

import * as React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { PackageSearch, QrCode } from "lucide-react";
import { getProjectMaterials, getSiteLocations, getWasteAnalytics } from "@/app/actions/materialActions";
import { useToast } from "@/contexts/ToastContext";
import { WasteLossAnalytics } from "@/components/ui/WasteLossAnalytics";
import { MaterialDetailsModal } from "@/components/ui/MaterialDetailsModal";
import { MaterialQRGenerator } from "@/components/ui/MaterialQRGenerator";
import { LogWasteModal } from "@/components/ui/LogWasteModal";

export default function MaterialsList({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [materials, setMaterials] = React.useState<any[]>([]);
  const [locations, setLocations] = React.useState<any[]>([]);
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const [selectedMaterial, setSelectedMaterial] = React.useState<any>(null);
  const [qrMaterial, setQrMaterial] = React.useState<any>(null);
  const [wasteMaterial, setWasteMaterial] = React.useState<any>(null);
  
  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const mats = await getProjectMaterials(id);
      const locs = await getSiteLocations(id);
      const stats = await getWasteAnalytics(id);
      
      setMaterials(mats || []);
      setLocations(locs || []);
      setAnalytics(stats);
      
      // Auto-Draft Restock Alert Logic (Module 5 Requirement)
      mats?.forEach((m: any) => {
        const threshold = m.custom_data?.restock_threshold;
        if (threshold && m.quantity < threshold) {
          toast.error(`Low Stock Alert: ${m.item_name} has fallen below restock threshold (${threshold}). Draft PO suggested.`);
        }
      });

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [id]);

  const columns = [
    { key: "item_name", header: "Material", cell: (row: any) => (
       <div className="flex flex-col">
         <button onClick={() => setSelectedMaterial(row)} className="font-semibold text-primary hover:underline text-left">{row.item_name}</button>
         <span className="text-xs text-on-surface-variant font-mono mt-0.5">PO: {row.po_number || 'N/A'}</span>
       </div>
    )},
    { key: "quantity", header: "Quantity", cell: (row: any) => {
      const threshold = row.custom_data?.restock_threshold;
      const isLow = threshold && row.quantity < threshold;
      return (
        <span className={`font-mono ${isLow ? 'text-semantic-crimson font-bold' : 'text-on-surface'}`}>
          {row.quantity} {isLow && <span className="text-[10px] ml-1 uppercase bg-semantic-crimson/10 px-1 rounded text-semantic-crimson">Low</span>}
        </span>
      );
    }},
    { key: "supplier_name", header: "Supplier", cell: (row: any) => <span className="text-sm">{row.supplier_name}</span> },
    { key: "location", header: "Laydown Yard", cell: (row: any) => {
       const loc = row.site_locations;
       if (!loc) return <span className="text-xs text-on-surface-variant italic">Unassigned</span>;
       return <span className="text-sm font-medium">{loc.zone ? `Zone ${loc.zone}` : loc.name}</span>;
    }},
    { key: "status", header: "Status", cell: (row: any) => (
       <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${row.status === 'On Site' ? 'bg-semantic-emerald-bg/10 text-semantic-emerald' : 'bg-surface-variant text-on-surface-variant'}`}>{row.status}</span>
    )},
    { key: "actions", header: "", cell: (row: any) => (
      <button onClick={() => setQrMaterial(row)} className="p-1.5 hover:bg-primary/10 text-primary rounded" title="Generate QR Tag">
        <QrCode className="w-4 h-4" />
      </button>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Procurement & Inventory" 
        subtitle="Manage materials, split-deliveries, and laydown yards via Barcode/QR."
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <PackageSearch className="w-4 h-4" /> Receive Material
          </button>
        }
      />
      
      <WasteLossAnalytics analytics={analytics} />

      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden min-h-[300px]">
        <DataTable columns={columns} data={materials} isLoading={isLoading} />
      </div>

      {selectedMaterial && (
        <MaterialDetailsModal 
          material={selectedMaterial} 
          locations={locations}
          onClose={() => setSelectedMaterial(null)}
          onRefresh={() => { setSelectedMaterial(null); loadData(); }} 
          onLogWaste={() => setWasteMaterial(selectedMaterial)}
        />
      )}

      {qrMaterial && (
        <MaterialQRGenerator 
          material={qrMaterial} 
          onClose={() => setQrMaterial(null)}
        />
      )}

      {wasteMaterial && (
        <LogWasteModal 
          material={wasteMaterial} 
          onClose={() => setWasteMaterial(null)}
          onRefresh={() => { setWasteMaterial(null); loadData(); }} 
        />
      )}
    </div>
  );
}
