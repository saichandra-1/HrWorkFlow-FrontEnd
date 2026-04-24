/**
 * NodeEditorPanel — Right panel for editing selected node configuration
 * Renders the appropriate form based on node type
 */

'use client';

import React from 'react';
import { X, Trash2, Play, ClipboardList, CheckCircle, Zap, Flag } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { NODE_TYPE_CONFIGS, WorkflowNodeType, StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData } from '@/types/workflow';
import StartNodeForm from '@/components/forms/StartNodeForm';
import TaskNodeForm from '@/components/forms/TaskNodeForm';
import ApprovalNodeForm from '@/components/forms/ApprovalNodeForm';
import AutomatedNodeForm from '@/components/forms/AutomatedNodeForm';
import EndNodeForm from '@/components/forms/EndNodeForm';

const nodeIcons: Record<WorkflowNodeType, React.ReactNode> = {
  start: <Play size={16} />,
  task: <ClipboardList size={16} />,
  approval: <CheckCircle size={16} />,
  automated: <Zap size={16} />,
  end: <Flag size={16} />,
};

export default function NodeEditorPanel() {
  const { selectedNodeId, nodes, selectNode, deleteNode, pushHistory } = useWorkflowStore();

  if (!selectedNodeId) return null;

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const nodeType = node.type as WorkflowNodeType;
  const config = NODE_TYPE_CONFIGS[nodeType];

  const handleDelete = () => {
    pushHistory();
    deleteNode(selectedNodeId);
  };

  const renderForm = () => {
    switch (nodeType) {
      case 'start':
        return <StartNodeForm nodeId={node.id} data={node.data as unknown as StartNodeData} />;
      case 'task':
        return <TaskNodeForm nodeId={node.id} data={node.data as unknown as TaskNodeData} />;
      case 'approval':
        return <ApprovalNodeForm nodeId={node.id} data={node.data as unknown as ApprovalNodeData} />;
      case 'automated':
        return <AutomatedNodeForm nodeId={node.id} data={node.data as unknown as AutomatedNodeData} />;
      case 'end':
        return <EndNodeForm nodeId={node.id} data={node.data as unknown as EndNodeData} />;
      default:
        return <p style={{ color: '#9ca3af', fontSize: 13 }}>Unknown node type</p>;
    }
  };

  return (
    <div className="panel">
      {/* Header */}
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: config?.color || '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {nodeIcons[nodeType]}
          </div>
          <div>
            <h3 style={{ margin: 0 }}>{config?.label || 'Node'} Settings</h3>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>ID: {node.id}</p>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => selectNode(null)}
          title="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Form content */}
      <div className="panel-content">
        {renderForm()}
      </div>

      {/* Footer */}
      <div className="panel-footer">
        <button
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
          style={{ flex: 1 }}
        >
          <Trash2 size={14} />
          Delete Node
        </button>
      </div>
    </div>
  );
}
