/**
 * AutomatedNodeForm — Configuration form for Automated Step nodes
 * Fields: title, action selection (from API), dynamic action parameters
 */

'use client';

import React from 'react';
import { AutomatedNodeData } from '@/types/workflow';
import { useWorkflowStore } from '@/store/workflowStore';
import { useAutomations } from '@/hooks/useAutomations';
import { Loader2 } from 'lucide-react';

interface Props {
  nodeId: string;
  data: AutomatedNodeData;
}

export default function AutomatedNodeForm({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { automations, loading } = useAutomations();

  const updateField = (field: keyof AutomatedNodeData, value: AutomatedNodeData[keyof AutomatedNodeData]) => {
    updateNodeData(nodeId, { [field]: value });
  };

  const selectedAction = automations.find((a) => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    const action = automations.find((a) => a.id === actionId);
    const params: Record<string, string> = {};
    if (action) {
      action.params.forEach((p) => {
        params[p] = data.actionParams?.[p] || '';
      });
    }
    updateField('actionId', actionId);
    updateField('actionParams', params);
  };

  const updateParam = (paramKey: string, value: string) => {
    updateField('actionParams', { ...data.actionParams, [paramKey]: value });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          className="form-input"
          type="text"
          value={data.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="e.g., Send Welcome Email"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Action</label>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', color: '#9ca3af', fontSize: 13 }}>
            <Loader2 size={14} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            Loading actions...
          </div>
        ) : (
          <select
            className="form-select"
            value={data.actionId || ''}
            onChange={(e) => handleActionChange(e.target.value)}
          >
            <option value="">Select an action...</option>
            {automations.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        )}
        {selectedAction && (
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
            {selectedAction.description}
          </p>
        )}
      </div>

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="form-group">
          <label className="form-label">Action Parameters</label>
          <div
            style={{
              background: '#f8f9fb',
              borderRadius: 8,
              padding: 12,
              border: '1px solid #e2e5e9',
            }}
          >
            {selectedAction.params.map((param) => (
              <div key={param} style={{ marginBottom: 10 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 500,
                    color: '#6b7280',
                    marginBottom: 4,
                    textTransform: 'capitalize',
                  }}
                >
                  {param.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                </label>
                <input
                  className="form-input"
                  type="text"
                  value={data.actionParams?.[param] || ''}
                  onChange={(e) => updateParam(param, e.target.value)}
                  placeholder={`Enter ${param}...`}
                  style={{ fontSize: 12 }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {!data.actionId && (
        <div
          style={{
            padding: 16,
            background: '#fef3c7',
            borderRadius: 8,
            border: '1px solid #fde68a',
            fontSize: 12,
            color: '#92400e',
            lineHeight: 1.5,
          }}
        >
          💡 Select an action from the dropdown to configure this automated step. Actions are loaded from the API.
        </div>
      )}
    </div>
  );
}
