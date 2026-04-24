/**
 * WorkspaceTabs — Horizontal workspace tab bar
 * Shows workspace tabs, active tab highlight, close buttons, + button to add
 */

'use client';

import React, { useState } from 'react';
import { Plus, X, Pencil, Check } from 'lucide-react';
import { useWorkspaceStore } from '@/store/workspaceStore';

const MAX_WORKSPACES = 5;

export default function WorkspaceTabs() {
  const {
    workspaces,
    activeWorkspaceId,
    switchWorkspace,
    addWorkspace,
    removeWorkspace,
    renameWorkspace,
  } = useWorkspaceStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditValue(currentName);
  };

  const handleFinishRename = () => {
    if (editingId && editValue.trim()) {
      renameWorkspace(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleFinishRename();
    if (e.key === 'Escape') {
      setEditingId(null);
      setEditValue('');
    }
  };

  return (
    <div className="workspace-tabs-bar">
      <div className="workspace-tabs-scroll">
        {workspaces.map((ws) => {
          const isActive = ws.id === activeWorkspaceId;
          const isEditing = editingId === ws.id;

          return (
            <div
              key={ws.id}
              className={`workspace-tab ${isActive ? 'active' : ''}`}
              onClick={() => switchWorkspace(ws.id)}
            >
              {/* Color dot */}
              <span
                className="ws-dot"
                style={{
                  background: isActive ? '#6366f1' : '#9ca3af',
                }}
              />

              {/* Tab name */}
              {isEditing ? (
                <input
                  className="ws-rename-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleFinishRename}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  maxLength={20}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  className="ws-name"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleStartRename(ws.id, ws.name);
                  }}
                >
                  {ws.name}
                </span>
              )}

              {/* Actions */}
              <div className="ws-actions">
                {!isEditing && (
                  <button
                    className="ws-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartRename(ws.id, ws.name);
                    }}
                    title="Rename"
                  >
                    <Pencil size={10} />
                  </button>
                )}
                {isEditing && (
                  <button
                    className="ws-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFinishRename();
                    }}
                    title="Save"
                  >
                    <Check size={10} />
                  </button>
                )}
                {workspaces.length > 1 && (
                  <button
                    className="ws-action-btn ws-close-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeWorkspace(ws.id);
                    }}
                    title="Close workspace"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add workspace button */}
      {workspaces.length < MAX_WORKSPACES && (
        <button
          className="workspace-add-btn"
          onClick={addWorkspace}
          title={`Add workspace (${workspaces.length}/${MAX_WORKSPACES})`}
        >
          <Plus size={14} />
        </button>
      )}

      {/* Workspace count indicator */}
      <span className="ws-count">
        {workspaces.length}/{MAX_WORKSPACES}
      </span>
    </div>
  );
}
