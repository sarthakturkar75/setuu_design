"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { useState, useEffect, use } from "react";
import { getCustomFieldsSchema, addCustomField, deleteCustomField } from "@/app/actions/customFieldsActions";
import { Trash2, Plus } from "lucide-react";

export default function CustomFieldsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { success, error } = useToast();
  
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityType, setEntityType] = useState("project_issues");
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadFields();
  }, [id, entityType]);

  async function loadFields() {
    setLoading(true);
    const data = await getCustomFieldsSchema(id, entityType);
    setFields(data);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newFieldName.trim()) return;
    
    // Simple sanitization to camelCase or snake_case for the internal key
    const fieldKey = newFieldName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
    
    setIsSubmitting(true);
    const res = await addCustomField(id, entityType, fieldKey, newFieldType, newFieldRequired);
    setIsSubmitting(false);
    
    if (res.success) {
      success("Field Added", `Successfully added ${fieldKey} to ${entityType}`);
      setNewFieldName("");
      setNewFieldType("text");
      setNewFieldRequired(false);
      loadFields();
    } else {
      error("Failed", res.error || "Could not add field");
    }
  }

  async function handleDelete(fieldId: string) {
    const res = await deleteCustomField(fieldId);
    if (res.success) {
      success("Field Removed", "The custom field was removed.");
      loadFields();
    } else {
      error("Failed", res.error || "Could not delete field");
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full max-w-[1600px] mx-auto p-6 gap-6">
      <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
        <h3 className="font-merriweather font-bold text-on-surface">Entity Types</h3>
        <div className="space-y-2">
          {[
            { id: "project_issues", label: "Issues & Defects" },
            { id: "project_materials", label: "Materials & Deliveries" },
            { id: "tasks", label: "Timeline Tasks" },
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setEntityType(type.id)}
              className={`block w-full text-left p-3 rounded-lg border transition-colors ${
                entityType === type.id
                  ? "bg-primary/5 border-primary text-primary font-semibold"
                  : "bg-surface border-outline-variant hover:bg-surface-variant text-on-surface"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <Card className="p-6">
          <h3 className="font-merriweather text-lg font-bold text-on-surface mb-2">Custom Fields for {entityType}</h3>
          <p className="text-sm text-on-surface-variant mb-6">
            Dynamically inject custom inputs into the creation and edit forms for this module.
          </p>
          
          <div className="bg-surface-variant/30 border border-outline-variant rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-sm mb-3">Add New Field</h4>
            <form onSubmit={handleAdd} className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Field Label</label>
                <input 
                  type="text" 
                  value={newFieldName}
                  onChange={e => setNewFieldName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded px-3 py-2 text-sm focus:border-primary outline-none"
                  placeholder="e.g. Serial Number"
                  required
                />
              </div>
              <div className="w-32">
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Type</label>
                <select 
                  value={newFieldType}
                  onChange={e => setNewFieldType(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded px-3 py-2 text-sm focus:border-primary outline-none"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="boolean">Checkbox (Yes/No)</option>
                </select>
              </div>
              <div className="w-24 pb-2 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="req"
                  checked={newFieldRequired}
                  onChange={e => setNewFieldRequired(e.target.checked)}
                />
                <label htmlFor="req" className="text-xs font-medium">Required</label>
              </div>
              <Button type="submit" disabled={isSubmitting || !newFieldName.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </form>
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="animate-pulse text-sm text-on-surface-variant p-4">Loading fields...</div>
            ) : fields.length === 0 ? (
              <div className="text-sm text-on-surface-variant p-4 text-center bg-surface-variant/20 rounded-lg border border-dashed border-outline-variant">
                No custom fields defined for {entityType}.
              </div>
            ) : (
              fields.map(field => (
                <div key={field.id} className="flex items-center justify-between p-3 border border-outline-variant rounded-lg bg-surface">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-on-surface">{field.field_name}</span>
                      {field.is_required && <span className="bg-semantic-crimson/10 text-semantic-crimson text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Required</span>}
                    </div>
                    <span className="text-xs text-on-surface-variant uppercase tracking-wider">{field.field_type}</span>
                  </div>
                  <button onClick={() => handleDelete(field.id)} className="p-2 text-on-surface-variant hover:text-semantic-crimson transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
