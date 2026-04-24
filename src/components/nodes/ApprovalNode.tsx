/**
 * ApprovalNode — Manager/HR approval step
 * Amber accent, CheckCircle icon, shows approver role and threshold
 */

'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CheckCircle, Shield, Clock } from 'lucide-react';
import { ApprovalNodeData, NODE_TYPE_CONFIGS } from '@/types/workflow';
import { useWorkflowStore } from '@/store/workflowStore';

const config = NODE_TYPE_CONFIGS.approval;

function ApprovalNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as ApprovalNodeData;
  const selectNode = useWorkflowStore((s) => s.selectNode);

  return (
    <div
      className={`workflow-node node-approval ${selected ? 'selected' : ''}`}
      onClick={() => selectNode(id)}
    >
      <div className="node-accent" style={{ background: config.color }} />

      <Handle type="target" position={Position.Top} id="target" />

      <div className="node-header">
        <div className="node-icon" style={{ background: config.color }}>
          <CheckCircle size={18} />
        </div>
        <div className="node-info">
          <div className="node-title">{nodeData.title || 'Approval'}</div>
          <div className="node-subtitle">Approval Required</div>
        </div>
      </div>

      <div className="node-badges">
        {nodeData.approverRole && (
          <span className="node-badge badge-warning">
            <Shield size={10} />
            {nodeData.approverRole}
          </span>
        )}
        {nodeData.autoApproveThreshold > 0 && (
          <span className="node-badge">
            <Clock size={10} />
            Auto: {nodeData.autoApproveThreshold}d
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} id="source" />
    </div>
  );
}

export default memo(ApprovalNode);
