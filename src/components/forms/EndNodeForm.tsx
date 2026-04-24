/**
 * EndNodeForm — Configuration form for End nodes
 * Fields: endMessage, showSummary (toggle)
 */

'use client';

import React from 'react';
import { EndNodeData } from '@/types/workflow';
import { useWorkflowStore } from '@/store/workflowStore';

interface Props {
  nodeId: string;
  data: EndNodeData;
}

export default function EndNodeForm({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const updateField = (field: keyof EndNodeData, value: EndNodeData[keyof EndNodeData]) => {
    updateNodeData(nodeId, { [field]: value });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="form-group">
        <label className="form-label">End Message</label>
        <textarea
          className="form-input form-textarea"
          value={data.endMessage || ''}
          onChange={(e) => updateField('endMessage', e.target.value)}
          placeholder="e.g., Onboarding complete! Welcome aboard."
          rows={3}
        />
        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          This message is displayed when the workflow reaches completion.
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">Summary Report</label>
        <div
          className="toggle-switch"
          onClick={() => updateField('showSummary', !data.showSummary)}
        >
          <div className={`toggle-track ${data.showSummary ? 'active' : ''}`}>
            <div className="toggle-thumb" />
          </div>
          <span style={{ fontSize: 13, color: data.showSummary ? '#1a1d23' : '#9ca3af' }}>
            {data.showSummary ? 'Generate summary report' : 'No summary report'}
          </span>
        </div>
        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>
          When enabled, a summary of all completed steps will be generated at workflow completion.
        </p>
      </div>
    </div>
  );
}
