/**
 * ApprovalNodeForm — Configuration form for Approval nodes
 * Fields: title, approverRole (dropdown), autoApproveThreshold
 */

'use client';

import React from 'react';
import { ApprovalNodeData } from '@/types/workflow';
import { useWorkflowStore } from '@/store/workflowStore';

interface Props {
  nodeId: string;
  data: ApprovalNodeData;
}

const APPROVER_ROLES = [
  'Manager',
  'Senior Manager',
  'Director',
  'VP',
  'HRBP',
  'HR Director',
  'Team Lead',
  'Department Head',
  'CEO',
  'CTO',
  'CFO',
];

export default function ApprovalNodeForm({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const updateField = (field: keyof ApprovalNodeData, value: ApprovalNodeData[keyof ApprovalNodeData]) => {
    updateNodeData(nodeId, { [field]: value });
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
          placeholder="e.g., Manager Approval"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Approver Role</label>
        <select
          className="form-select"
          value={data.approverRole || ''}
          onChange={(e) => updateField('approverRole', e.target.value)}
        >
          <option value="">Select a role...</option>
          {APPROVER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          The role responsible for approving this step
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">Auto-Approve Threshold (days)</label>
        <input
          className="form-input"
          type="number"
          min={0}
          max={30}
          value={data.autoApproveThreshold || 0}
          onChange={(e) => updateField('autoApproveThreshold', parseInt(e.target.value) || 0)}
          placeholder="0"
        />
        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          Automatically approve if no response within this many days. Set to 0 to disable.
        </p>
      </div>
    </div>
  );
}
