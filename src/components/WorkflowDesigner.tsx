/**
 * WorkflowDesigner — Main client component assembling all parts
 * Sidebar (collapsible) + Toolbar (with workspace tabs) + Canvas + NodeEditor + SimulationPanel
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Sidebar from '@/components/panels/Sidebar';
import Toolbar from '@/components/panels/Toolbar';
import WorkflowCanvas from '@/components/canvas/WorkflowCanvas';
import NodeEditorPanel from '@/components/panels/NodeEditorPanel';
import SimulationPanel from '@/components/panels/SimulationPanel';
import WorkspaceTabs from '@/components/panels/WorkspaceTabs';
import { useWorkflowStore } from '@/store/workflowStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { PanelLeftOpen } from 'lucide-react';

function WorkflowDesignerInner() {
  const [simulationOpen, setSimulationOpen] = useState(false);
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const { onDragStart } = useDragAndDrop();

  const {
    sidebarOpen,
    toggleSidebar,
    activeWorkspaceId,
    workspaces,
    saveCurrentWorkspace,
  } = useWorkspaceStore();

  const {
    nodes,
    edges,
    simulationResult,
    setWorkflow,
    selectNode,
    setSimulationResult,
  } = useWorkflowStore();

  // Save current workflow state to workspace whenever it changes
  useEffect(() => {
    saveCurrentWorkspace(nodes, edges, selectedNodeId, simulationResult);
  }, [nodes, edges, selectedNodeId, simulationResult, saveCurrentWorkspace]);

  // Load workspace data when switching workspaces
  const loadWorkspace = useCallback(
    (workspaceId: string) => {
      const ws = workspaces.find((w) => w.id === workspaceId);
      if (ws) {
        setWorkflow(ws.nodes, ws.edges);
        selectNode(ws.selectedNodeId);
        setSimulationResult(ws.simulationResult);
      }
    },
    [workspaces, setWorkflow, selectNode, setSimulationResult]
  );

  const [prevWorkspaceId, setPrevWorkspaceId] = useState(activeWorkspaceId);
  useEffect(() => {
    if (activeWorkspaceId !== prevWorkspaceId) {
      loadWorkspace(activeWorkspaceId);
      setPrevWorkspaceId(activeWorkspaceId);
    }
  }, [activeWorkspaceId, prevWorkspaceId, loadWorkspace]);

  useKeyboardShortcuts();

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Floating sidebar open button (only when collapsed) */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 10,
            left: 10,
            zIndex: 50,
            background: '#1e1f2e',
            color: 'white',
            borderRadius: 8,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Open Sidebar"
        >
          <PanelLeftOpen size={18} />
        </button>
      )}

      {/* Sidebar with smooth collapse */}
      <div
        style={{
          width: sidebarOpen ? 260 : 0,
          minWidth: sidebarOpen ? 260 : 0,
          overflow: 'hidden',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Sidebar onDragStart={onDragStart} onToggleSidebar={toggleSidebar} />
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <Toolbar
          onToggleSimulation={() => setSimulationOpen(!simulationOpen)}
          simulationOpen={simulationOpen}
        />

        {/* Canvas + Panels */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <WorkflowCanvas />

          {selectedNodeId && <NodeEditorPanel />}
          {simulationOpen && !selectedNodeId && (
            <SimulationPanel
              open={simulationOpen}
              onClose={() => setSimulationOpen(false)}
            />
          )}
        </div>

        {/* Workspace Tabs (Footer) */}
        <WorkspaceTabs />
      </div>
    </div>
  );
}

export default function WorkflowDesigner() {
  return (
    <ReactFlowProvider>
      <WorkflowDesignerInner />
    </ReactFlowProvider>
  );
}
