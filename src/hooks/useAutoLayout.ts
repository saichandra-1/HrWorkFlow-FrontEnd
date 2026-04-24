/**
 * Custom hook for auto-layout using dagre algorithm
 */

'use client';

import { useCallback } from 'react';
import dagre from 'dagre';
import { Node, Edge } from '@xyflow/react';
import { useWorkflowStore } from '@/store/workflowStore';

const NODE_WIDTH = 250;
const NODE_HEIGHT = 100;

export function useAutoLayout() {
  const { nodes, edges, setWorkflow, pushHistory } = useWorkflowStore();

  const autoLayout = useCallback(() => {
    if (nodes.length === 0) return;

    pushHistory();

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({
      rankdir: 'TB',
      nodesep: 60,
      ranksep: 80,
      marginx: 40,
      marginy: 40,
    });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes: Node[] = nodes.map((node) => {
      const dagreNode = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: dagreNode.x - NODE_WIDTH / 2,
          y: dagreNode.y - NODE_HEIGHT / 2,
        },
      };
    });

    setWorkflow(newNodes, edges);
  }, [nodes, edges, setWorkflow, pushHistory]);

  return { autoLayout };
}
