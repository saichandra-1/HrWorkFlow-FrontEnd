/**
 * TaskNodeForm — Configuration form for Task nodes
 * Fields: title, description, assignee, dueDate, custom fields
 */

'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';
import { TaskNodeData } from '@/types/workflow';
import { useWorkflowStore } from '@/store/workflowStore';

interface Props {
  nodeId: string;
  data: TaskNodeData;
}

export default function TaskNodeForm({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const updateField = (field: keyof TaskNodeData, value: TaskNodeData[keyof TaskNodeData]) => {
    updateNodeData(nodeId, { [field]: value });
  };

  const addCustomField = () => {
    const key = `field_${Object.keys(data.customFields || {}).length + 1}`;
    updateField('customFields', { ...data.customFields, [key]: '' });
  };

  const updateCustomFieldKey = (oldKey: string, newKey: string) => {
    const entries = Object.entries(data.customFields || {});
    const newFields: Record<string, string> = {};
    entries.forEach(([k, v]) => {
      newFields[k === oldKey ? newKey : k] = v;
    });
    updateField('customFields', newFields);
  };

  const updateCustomFieldValue = (key: string, value: string) => {
    updateField('customFields', { ...data.customFields, [key]: value });
  };

  const removeCustomField = (key: string) => {
    const newFields = { ...data.customFields };
    delete newFields[key];
    updateField('customFields', newFields);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="form-group">
        <label className="form-label">
          Title <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          className="form-input"
          type="text"
          value={data.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="e.g., Collect Documents"
          required
        />
        {!data.title && (
          <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>Title is required</p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-input form-textarea"
          value={data.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Describe the task in detail..."
          rows={3}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="form-group">
          <label className="form-label">Assignee</label>
          <input
            className="form-input"
            type="text"
            value={data.assignee || ''}
            onChange={(e) => updateField('assignee', e.target.value)}
            placeholder="e.g., HR Coordinator"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input
            className="form-input"
            type="date"
            value={data.dueDate || ''}
            onChange={(e) => updateField('dueDate', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <label className="form-label" style={{ margin: 0 }}>Custom Fields</label>
          <button className="btn btn-ghost btn-sm" onClick={addCustomField}>
            <Plus size={14} />
            Add Field
          </button>
        </div>

        {Object.entries(data.customFields || {}).map(([key, value]) => (
          <div className="kv-row" key={key}>
            <input
              className="form-input"
              type="text"
              value={key}
              onChange={(e) => updateCustomFieldKey(key, e.target.value)}
              placeholder="Field name"
              style={{ fontSize: 12 }}
            />
            <input
              className="form-input"
              type="text"
              value={value}
              onChange={(e) => updateCustomFieldValue(key, e.target.value)}
              placeholder="Field value"
              style={{ fontSize: 12 }}
            />
            <button className="kv-remove" onClick={() => removeCustomField(key)}>
              <X size={14} />
            </button>
          </div>
        ))}

        {Object.keys(data.customFields || {}).length === 0 && (
          <p style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>
            No custom fields. Click &quot;Add Field&quot; to add key-value pairs.
          </p>
        )}
      </div>
    </div>
  );
}
