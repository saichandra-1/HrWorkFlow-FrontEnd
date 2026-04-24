/**
 * EndNode — Workflow completion
 * Rose accent, Flag icon, shows end message and summary flag
 */

'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Flag, FileText } from 'lucide-react';
import { EndNodeData, NODE_TYPE_CONFIGS } from '@/types/workflow';
import { useWorkflowStore } from '@/store/workflowStore';

const config = NODE_TYPE_CONFIGS.end;

function EndNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as EndNodeData;
  const selectNode = useWorkflowStore((s) => s.selectNode);

  return (
    <div
      className={`workflow-node node-end ${selected ? 'selected' : ''}`}
      onClick={() => selectNode(id)}
    >
      <div className="node-accent" style={{ background: config.color }} />

      <Handle type="target" position={Position.Top} id="target" />

      <div className="node-header">
        <div className="node-icon" style={{ background: config.color }}>
          <Flag size={18} />
        </div>
        <div className="node-info">
          <div className="node-title">{nodeData.endMessage || 'End'}</div>
          <div className="node-subtitle">Workflow Completion</div>
        </div>
      </div>

      {nodeData.showSummary && (
        <div className="node-badges">
          <span className="node-badge badge-success">
            <FileText size={10} />
            Summary enabled
          </span>
        </div>
      )}
    </div>
  );
}

export default memo(EndNode);
