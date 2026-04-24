/**
 * Toolbar — Top bar with undo/redo, zoom, auto-layout, and simulation controls
 */

'use client';

import React from 'react';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlignVerticalJustifyCenter,
  Play,
  Workflow,
  Loader2,
} from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { useWorkflowStore } from '@/store/workflowStore';
import { useAutoLayout } from '@/hooks/useAutoLayout';

interface Props {
  onToggleSimulation: () => void;
  simulationOpen: boolean;
}

export default function Toolbar({ onToggleSimulation, simulationOpen }: Props) {
  const { undo, redo, canUndo, canRedo, nodes, isSimulating } = useWorkflowStore();
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { autoLayout } = useAutoLayout();

  return (
    <div className="toolbar">
      {/* Left: Title */}
      <div className="toolbar-group">
        <Workflow size={16} color="#6366f1" />
        <span style={{ fontSize: 14, fontWeight: 600, marginLeft: 4 }}>
          Workflow Designer
        </span>
        {nodes.length > 0 && (
          <span
            style={{
              fontSize: 11,
              color: '#9ca3af',
              marginLeft: 8,
              padding: '2px 8px',
              background: '#f4f5f7',
              borderRadius: 999,
            }}
          >
            {nodes.length} node{nodes.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Center: Actions */}
      <div className="toolbar-group">
        <button
          className="btn btn-ghost btn-icon tooltip-trigger"
          onClick={() => undo()}
          disabled={!canUndo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          className="btn btn-ghost btn-icon tooltip-trigger"
          onClick={() => redo()}
          disabled={!canRedo()}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={16} />
        </button>

        <div className="toolbar-divider" />

        <button
          className="btn btn-ghost btn-icon"
          onClick={() => zoomIn()}
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => zoomOut()}
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => fitView({ padding: 0.2, duration: 300 })}
          title="Fit View"
        >
          <Maximize2 size={16} />
        </button>

        <div className="toolbar-divider" />

        <button
          className="btn btn-ghost btn-sm"
          onClick={autoLayout}
          disabled={nodes.length === 0}
          title="Auto Layout"
        >
          <AlignVerticalJustifyCenter size={14} />
          Auto Layout
        </button>
      </div>

      {/* Right: Simulation toggle */}
      <div className="toolbar-group">
        <button
          className={`btn ${simulationOpen ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={onToggleSimulation}
          disabled={isSimulating}
        >
          {isSimulating ? (
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Play size={14} />
          )}
          {simulationOpen ? 'Sandbox Open' : 'Test Workflow'}
        </button>
      </div>
    </div>
  );
}
