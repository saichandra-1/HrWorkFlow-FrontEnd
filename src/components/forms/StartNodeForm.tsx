/**
 * StartNodeForm — Configuration form for Start nodes
 * Fields: title, metadata key-value pairs
 */

'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';
import { StartNodeData } from '@/types/workflow';
import { useWorkflowStore } from '@/store/workflowStore';

interface Props {
  nodeId: string;
  data: StartNodeData;
}

export default function StartNodeForm({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const updateField = (field: keyof StartNodeData, value: StartNodeData[keyof StartNodeData]) => {
    updateNodeData(nodeId, { [field]: value });
  };

  const addMetadata = () => {
    const key = `key_${Object.keys(data.metadata || {}).length + 1}`;
    updateField('metadata', { ...data.metadata, [key]: '' });
  };

  const updateMetadataKey = (oldKey: string, newKey: string) => {
    const entries = Object.entries(data.metadata || {});
    const newMetadata: Record<string, string> = {};
    entries.forEach(([k, v]) => {
      newMetadata[k === oldKey ? newKey : k] = v;
    });
    updateField('metadata', newMetadata);
  };

  const updateMetadataValue = (key: string, value: string) => {
    updateField('metadata', { ...data.metadata, [key]: value });
  };

  const removeMetadata = (key: string) => {
    const newMetadata = { ...data.metadata };
    delete newMetadata[key];
    updateField('metadata', newMetadata);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="form-group">
        <label className="form-label">Start Title</label>
        <input
          className="form-input"
          type="text"
          value={data.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="e.g., New Employee Onboarding"
        />
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <label className="form-label" style={{ margin: 0 }}>Metadata</label>
          <button className="btn btn-ghost btn-sm" onClick={addMetadata}>
            <Plus size={14} />
            Add
          </button>
        </div>

        {Object.entries(data.metadata || {}).map(([key, value]) => (
          <div className="kv-row" key={key}>
            <input
              className="form-input"
              type="text"
              value={key}
              onChange={(e) => updateMetadataKey(key, e.target.value)}
              placeholder="Key"
              style={{ fontSize: 12 }}
            />
            <input
              className="form-input"
              type="text"
              value={value}
              onChange={(e) => updateMetadataValue(key, e.target.value)}
              placeholder="Value"
              style={{ fontSize: 12 }}
            />
            <button className="kv-remove" onClick={() => removeMetadata(key)}>
              <X size={14} />
            </button>
          </div>
        ))}

        {Object.keys(data.metadata || {}).length === 0 && (
          <p style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>
            No metadata defined. Click &quot;Add&quot; to add key-value pairs.
          </p>
        )}
      </div>
    </div>
  );
}
