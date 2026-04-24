/**
 * Zustand store for workflow state management
 * Manages nodes, edges, selection, undo/redo, and workflow operations
 */

import { create } from 'zustand';
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
} from '@xyflow/react';
import {
  WorkflowNodeType,
  WorkflowNodeData,
  createDefaultNodeData,
  SimulationResult,
} from '@/types/workflow';

interface HistoryEntry {
  nodes: Node[];
  edges: Edge[];
}

interface WorkflowState {
  // Core state
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;

  // Simulation
  simulationResult: SimulationResult | null;
  isSimulating: boolean;

  // Undo/Redo
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];

  // Actions — React Flow handlers
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  // Actions — Node operations
  addNode: (type: WorkflowNodeType, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;

  // Actions — Workflow operations
  setWorkflow: (nodes: Node[], edges: Edge[]) => void;
  clearWorkflow: () => void;
  exportWorkflow: () => { nodes: Node[]; edges: Edge[] };
  importWorkflow: (data: { nodes: Node[]; edges: Edge[] }) => void;

  // Actions — Simulation
  setSimulationResult: (result: SimulationResult | null) => void;
  setIsSimulating: (value: boolean) => void;

  // Actions — Undo/Redo
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

let nodeIdCounter = 0;

const generateNodeId = (type: WorkflowNodeType): string => {
  nodeIdCounter++;
  return `${type}-${Date.now()}-${nodeIdCounter}`;
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationResult: null,
  isSimulating: false,
  undoStack: [],
  redoStack: [],

  // React Flow change handlers
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    get().pushHistory();
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        },
        get().edges
      ),
    });
  },

  // Node operations
  addNode: (type, position) => {
    get().pushHistory();
    const id = generateNodeId(type);
    const data = createDefaultNodeData(type) as unknown as Record<string, unknown>;

    const newNode: Node = {
      id,
      type,
      position,
      data,
    };

    set({
      nodes: [...get().nodes, newNode],
    });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
  },

  deleteNode: (nodeId) => {
    get().pushHistory();
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  // Workflow operations
  setWorkflow: (nodes, edges) => {
    get().pushHistory();
    set({ nodes, edges, selectedNodeId: null });
  },

  clearWorkflow: () => {
    get().pushHistory();
    set({ nodes: [], edges: [], selectedNodeId: null, simulationResult: null });
  },

  exportWorkflow: () => {
    const { nodes, edges } = get();
    return {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
      })) as Node[],
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: e.type,
      })) as Edge[],
    };
  },

  importWorkflow: (data) => {
    get().pushHistory();
    const edges = data.edges.map((e) => ({
      ...e,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#94a3b8', strokeWidth: 2 },
    }));
    set({
      nodes: data.nodes,
      edges,
      selectedNodeId: null,
      simulationResult: null,
    });
  },

  // Simulation
  setSimulationResult: (result) => {
    set({ simulationResult: result });
  },

  setIsSimulating: (value) => {
    set({ isSimulating: value });
  },

  // Undo/Redo
  pushHistory: () => {
    const { nodes, edges, undoStack } = get();
    const entry: HistoryEntry = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    // Keep last 30 entries
    const newStack = [...undoStack, entry].slice(-30);
    set({ undoStack: newStack, redoStack: [] });
  },

  undo: () => {
    const { undoStack, nodes, edges, redoStack } = get();
    if (undoStack.length === 0) return;

    const previous = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      undoStack: newUndoStack,
      redoStack: [
        ...redoStack,
        { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) },
      ],
      selectedNodeId: null,
    });
  },

  redo: () => {
    const { redoStack, nodes, edges, undoStack } = get();
    if (redoStack.length === 0) return;

    const next = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    set({
      nodes: next.nodes,
      edges: next.edges,
      redoStack: newRedoStack,
      undoStack: [
        ...undoStack,
        { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) },
      ],
      selectedNodeId: null,
    });
  },

  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,
}));
