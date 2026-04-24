/**
 * AutomatedNode — System-triggered action step
 * Purple accent, Zap icon, shows selected action
 */

'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap, Settings } from 'lucide-react';
import { AutomatedNodeData, NODE_TYPE_CONFIGS } from '@/types/workflow';
import { useWorkflowStore } from '@/store/workflowStore';

const config = NODE_TYPE_CONFIGS.automated;

function AutomatedNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as AutomatedNodeData;
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const paramCount = Object.keys(nodeData.actionParams || {}).filter(
    (k) => nodeData.actionParams[k]
  ).length;

  return (
    <div
      className={`workflow-node node-automated ${selected ? 'selected' : ''}`}
      onClick={() => selectNode(id)}
    >
      <div className="node-accent" style={{ background: config.color }} />

      <Handle type="target" position={Position.Top} id="target" />

      <div className="node-header">
        <div className="node-icon" style={{ background: config.color }}>
          <Zap size={18} />
        </div>
        <div className="node-info">
          <div className="node-title">{nodeData.title || 'Automated Step'}</div>
          {nodeData.actionId && (
            <div className="node-subtitle">
              {nodeData.actionId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </div>
          )}
        </div>
      </div>

      <div className="node-badges">
        {nodeData.actionId && (
          <span className="node-badge" style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <Zap size={10} />
            {nodeData.actionId}
          </span>
        )}
        {paramCount > 0 && (
          <span className="node-badge">
            <Settings size={10} />
            {paramCount} params
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} id="source" />
    </div>
  );
}

export default memo(AutomatedNode);
