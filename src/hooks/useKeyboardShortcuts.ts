/**
 * Custom hook for keyboard shortcuts (Undo/Redo, Delete)
 */

'use client';

import { useEffect, useCallback } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';

export function useKeyboardShortcuts() {
  const { undo, redo, deleteNode, selectedNodeId, canUndo, canRedo } = useWorkflowStore();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl/Cmd + Z → Undo
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo()) undo();
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y → Redo
      if (
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z') ||
        ((event.ctrlKey || event.metaKey) && event.key === 'y')
      ) {
        event.preventDefault();
        if (canRedo()) redo();
      }

      // Delete or Backspace → Delete selected node
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNodeId) {
        event.preventDefault();
        deleteNode(selectedNodeId);
      }
    },
    [undo, redo, deleteNode, selectedNodeId, canUndo, canRedo]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
