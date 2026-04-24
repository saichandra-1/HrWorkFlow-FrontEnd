/**
 * StartNode — Workflow entry point
 * Green accent, Play icon, displays title and metadata count
 */

'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play, Settings } from 'lucide-react';
import { StartNodeData, NODE_TYPE_CONFIGS } from '@/types/workflow';
import { useWorkflowStore } from '@/store/workflowStore';

const config = NODE_TYPE_CONFIGS.start;

function StartNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as StartNodeData;
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const metadataCount = Object.keys(nodeData.metadata || {}).length;

  return (
    <div
      className={`workflow-node node-start ${selected ? 'selected' : ''}`}
      onClick={() => selectNode(id)}
    >
      <div className="node-accent" style={{ background: config.color }} />

      <div className="node-header">
        <div className="node-icon" style={{ background: config.color }}>
          <Play size={18} />
        </div>
        <div className="node-info">
          <div className="node-title">{nodeData.title || 'Start'}</div>
          <div className="node-subtitle">Workflow Entry Point</div>
        </div>
      </div>

      {metadataCount > 0 && (
        <div className="node-badges">
          <span className="node-badge badge-success">
            <Settings size={10} />
            {metadataCount} metadata
          </span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
      />
    </div>
  );
}

export default memo(StartNode);
