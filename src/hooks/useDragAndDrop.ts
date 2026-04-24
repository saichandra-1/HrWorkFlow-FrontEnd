/**
 * Custom hook for handling drag-and-drop from sidebar to canvas
 */

'use client';

import { useCallback, useRef, DragEvent } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useWorkflowStore } from '@/store/workflowStore';
import { WorkflowNodeType } from '@/types/workflow';

export function useDragAndDrop() {
  const reactFlowInstance = useReactFlow();
  const addNode = useWorkflowStore((state) => state.addNode);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as WorkflowNodeType;
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [reactFlowInstance, addNode]
  );

  const onDragStart = useCallback((event: DragEvent, nodeType: WorkflowNodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  return {
    reactFlowWrapper,
    onDragOver,
    onDrop,
    onDragStart,
  };
}
