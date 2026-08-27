"use client";

import React, { useEffect, useState } from "react";
import { getCustomFieldsSchema } from "@/app/actions/customFieldsActions";
import { TextInput } from "./TextInput";

interface DynamicCustomFieldsProps {
  projectId: string;
  entityType: string;
  onChange: (values: any) => void;
  values?: any;
}

export function DynamicCustomFields({ projectId, entityType, onChange, values = {} }: DynamicCustomFieldsProps) {
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchema() {
      const schema = await getCustomFieldsSchema(projectId, entityType);
      setFields(schema);
      setLoading(false);
    }
    fetchSchema();
  }, [projectId, entityType]);

  const handleChange = (key: string, value: any) => {
    onChange({ ...values, [key]: value });
  };

  if (loading) return null;
  if (fields.length === 0) return null;

  return (
    <div className="space-y-4 pt-4 mt-4 border-t border-outline-variant">
      <h4 className="text-sm font-semibold text-on-surface">Custom Attributes</h4>
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-on-surface">
            {field.field_name.replace(/_/g, " ")} {field.is_required && <span className="text-semantic-crimson">*</span>}
          </label>
          {field.field_type === "boolean" ? (
            <input
              type="checkbox"
              checked={values[field.field_name] || false}
              onChange={(e) => handleChange(field.field_name, e.target.checked)}
              className="w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary"
            />
          ) : (
            <TextInput
              type={field.field_type === "date" ? "date" : field.field_type === "number" ? "number" : "text"}
              value={values[field.field_name] || ""}
              onChange={(e) => handleChange(field.field_name, e.target.value)}
              required={field.is_required}
              placeholder={`Enter ${field.field_name.replace(/_/g, " ")}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
