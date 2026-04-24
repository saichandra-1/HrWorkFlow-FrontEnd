/**
 * Workspace store — manages multiple workspaces (up to 5)
 * Each workspace has its own independent workflow state
 */

'use client';

import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';
import { SimulationResult } from '@/types/workflow';

export interface Workspace {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  simulationResult: SimulationResult | null;
}

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  sidebarOpen: boolean;

  // Actions
  addWorkspace: () => void;
  removeWorkspace: (id: string) => void;
  switchWorkspace: (id: string) => void;
  renameWorkspace: (id: string, name: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Sync current workflow state into workspace
  saveCurrentWorkspace: (nodes: Node[], edges: Edge[], selectedNodeId: string | null, simulationResult: SimulationResult | null) => void;
  getActiveWorkspace: () => Workspace;
}

const MAX_WORKSPACES = 5;

let wsCounter = 1;

const createWorkspace = (index: number): Workspace => ({
  id: `ws-${Date.now()}-${index}`,
  name: `Workspace ${index}`,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationResult: null,
});

const initialWorkspace = createWorkspace(wsCounter);

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [initialWorkspace],
  activeWorkspaceId: initialWorkspace.id,
  sidebarOpen: true,

  addWorkspace: () => {
    const { workspaces } = get();
    if (workspaces.length >= MAX_WORKSPACES) return;

    wsCounter++;
    const newWs = createWorkspace(wsCounter);
    set({
      workspaces: [...workspaces, newWs],
      activeWorkspaceId: newWs.id,
    });
  },

  removeWorkspace: (id) => {
    const { workspaces, activeWorkspaceId } = get();
    if (workspaces.length <= 1) return; // Can't remove last workspace

    const filtered = workspaces.filter((ws) => ws.id !== id);
    const newActive =
      activeWorkspaceId === id ? filtered[0].id : activeWorkspaceId;

    set({
      workspaces: filtered,
      activeWorkspaceId: newActive,
    });
  },

  switchWorkspace: (id) => {
    set({ activeWorkspaceId: id });
  },

  renameWorkspace: (id, name) => {
    set({
      workspaces: get().workspaces.map((ws) =>
        ws.id === id ? { ...ws, name } : ws
      ),
    });
  },

  toggleSidebar: () => {
    set({ sidebarOpen: !get().sidebarOpen });
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },

  saveCurrentWorkspace: (nodes, edges, selectedNodeId, simulationResult) => {
    const { activeWorkspaceId } = get();
    set({
      workspaces: get().workspaces.map((ws) =>
        ws.id === activeWorkspaceId
          ? { ...ws, nodes, edges, selectedNodeId, simulationResult }
          : ws
      ),
    });
  },

  getActiveWorkspace: () => {
    const { workspaces, activeWorkspaceId } = get();
    return workspaces.find((ws) => ws.id === activeWorkspaceId) || workspaces[0];
  },
}));
