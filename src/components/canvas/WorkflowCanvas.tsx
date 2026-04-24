/**
 * WorkflowCanvas — Main React Flow canvas with all node types, controls, and minimap
 */

'use client';

import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Node,
  useReactFlow,
} from '@xyflow/react';
import { nodeTypes } from '@/components/nodes';
import { useWorkflowStore } from '@/store/workflowStore';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { NODE_TYPE_CONFIGS, WorkflowNodeType } from '@/types/workflow';

const miniMapNodeColor = (node: Node) => {
  const type = node.type as WorkflowNodeType;
  return NODE_TYPE_CONFIGS[type]?.color || '#6b7280';
};

export default function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    selectedNodeId,
  } = useWorkflowStore();

  const { onDragOver, onDrop } = useDragAndDrop();

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div style={{ flex: 1, height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        }}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        snapToGrid
        snapGrid={[15, 15]}
        deleteKeyCode={['Delete', 'Backspace']}
        multiSelectionKeyCode="Shift"
        style={{ background: '#f8f9fb' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="#d1d5db"
        />
        <Controls
          position="bottom-left"
          showInteractive={false}
        />
        <MiniMap
          position="bottom-right"
          nodeColor={miniMapNodeColor}
          maskColor="rgba(248, 249, 251, 0.7)"
          pannable
          zoomable
          style={{ width: 180, height: 120 }}
        />
      </ReactFlow>
    </div>
  );
}
