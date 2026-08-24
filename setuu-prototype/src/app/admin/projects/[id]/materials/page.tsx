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
import { MaterialCreateModal } from "@/components/ui/MaterialCreateModal";

export default function MaterialsList({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [materials, setMaterials] = React.useState<any[]>([]);
  const [locations, setLocations] = React.useState<any[]>([]);
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const [selectedMaterial, setSelectedMaterial] = React.useState<any>(null);
  const [qrMaterial, setQrMaterial] = React.useState<any>(null);
  const [wasteMaterial, setWasteMaterial] = React.useState<any>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  
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
          <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <PackageSearch className="w-4 h-4" /> Receive Material
          </button>
        }
      />
      
      
      
      <details className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-4 group [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex items-center justify-between cursor-pointer list-none">
          <div>
            <h4 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Logistics API Integration (Geofencing)
            </h4>
            <p className="text-xs text-on-surface-variant mt-1 group-open:hidden">Click to view the webhook credentials for your third-party logistics vendors.</p>
          </div>
          <span className="text-primary text-sm font-medium bg-primary/10 px-3 py-1 rounded-full group-open:hidden">View API Keys</span>
        </summary>
        
        <div className="mt-4 pt-4 border-t border-outline-variant/50 flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-sm text-on-surface-variant mb-4">
              Provide this endpoint to your trucking or logistics partner. When their trucks cross the site's geofence radius, their system will hit this Webhook. This automatically updates the material's Delivery Timeline and alerts the PM without any manual data entry.
            </p>
            <code className="text-xs font-mono bg-surface p-2 rounded-lg border border-outline-variant/30 text-primary block break-all">
              POST {typeof window !== 'undefined' ? window.location.origin : 'https://api.praimo.com'}/api/webhooks/logistics-geofence
            </code>
          </div>
          <div className="w-full md:w-auto">
            <div className="text-[10px] font-bold text-on-surface-variant uppercase mb-2 tracking-wider">Example JSON Payload</div>
            <pre className="text-xs font-mono text-on-surface-variant bg-surface p-3 border border-outline-variant/50 rounded-lg shadow-sm whitespace-pre-wrap">
{JSON.stringify({
  materialId: "uuid-of-the-material",
  lat: 34.0522,
  lng: -118.2437,
  eventType: "ENTERED_GEOFENCE"
}, null, 2)}
            </pre>
          </div>
        </div>
      </details>


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

      
      {isCreating && (
        <MaterialCreateModal 
          projectId={id}
          onClose={() => setIsCreating(false)}
          onRefresh={loadData}
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
