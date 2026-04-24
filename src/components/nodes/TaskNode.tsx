/**
 * TaskNode — Human task step
 * Blue accent, ClipboardList icon, displays assignee and due date
 */

'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ClipboardList, User, Calendar } from 'lucide-react';
import { TaskNodeData, NODE_TYPE_CONFIGS } from '@/types/workflow';
import { useWorkflowStore } from '@/store/workflowStore';

const config = NODE_TYPE_CONFIGS.task;

function TaskNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as TaskNodeData;
  const selectNode = useWorkflowStore((s) => s.selectNode);

  return (
    <div
      className={`workflow-node node-task ${selected ? 'selected' : ''}`}
      onClick={() => selectNode(id)}
    >
      <div className="node-accent" style={{ background: config.color }} />

      <Handle type="target" position={Position.Top} id="target" />

      <div className="node-header">
        <div className="node-icon" style={{ background: config.color }}>
          <ClipboardList size={18} />
        </div>
        <div className="node-info">
          <div className="node-title">{nodeData.title || 'Task'}</div>
          {nodeData.description && (
            <div className="node-subtitle">{nodeData.description}</div>
          )}
        </div>
      </div>

      <div className="node-badges">
        {nodeData.assignee && (
          <span className="node-badge badge-info">
            <User size={10} />
            {nodeData.assignee}
          </span>
        )}
        {nodeData.dueDate && (
          <span className="node-badge badge-warning">
            <Calendar size={10} />
            {nodeData.dueDate}
          </span>
        )}
        {Object.keys(nodeData.customFields || {}).length > 0 && (
          <span className="node-badge">
            +{Object.keys(nodeData.customFields).length} fields
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} id="source" />
    </div>
  );
}

export default memo(TaskNode);
