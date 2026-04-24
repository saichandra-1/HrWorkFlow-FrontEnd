/**
 * Custom hook for running workflow simulation
 */

'use client';

import { useState, useCallback } from 'react';
import { SimulationResult } from '@/types/workflow';
import { simulateWorkflow } from '@/lib/api';
import { useWorkflowStore } from '@/store/workflowStore';

interface UseSimulationReturn {
  result: SimulationResult | null;
  loading: boolean;
  error: string | null;
  runSimulation: () => Promise<void>;
  clearResult: () => void;
}

export function useSimulation(): UseSimulationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nodes, edges, setSimulationResult, simulationResult, setIsSimulating } = useWorkflowStore();

  const runSimulation = useCallback(async () => {
    if (nodes.length === 0) {
      setError('Add some nodes to the workflow before simulating');
      return;
    }

    setLoading(true);
    setIsSimulating(true);
    setError(null);

    try {
      const result = await simulateWorkflow(nodes, edges);
      setSimulationResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Simulation failed';
      setError(errorMessage);

      // Fallback: run client-side simulation if backend is down
      const fallbackResult = runClientSideSimulation(nodes, edges);
      setSimulationResult(fallbackResult);
    } finally {
      setLoading(false);
      setIsSimulating(false);
    }
  }, [nodes, edges, setSimulationResult, setIsSimulating]);

  const clearResult = useCallback(() => {
    setSimulationResult(null);
    setError(null);
  }, [setSimulationResult]);

  return {
    result: simulationResult,
    loading,
    error,
    runSimulation,
    clearResult,
  };
}

/**
 * Client-side fallback simulation when backend is unavailable
 */
function runClientSideSimulation(nodes: ReturnType<typeof useWorkflowStore.getState>['nodes'], edges: ReturnType<typeof useWorkflowStore.getState>['edges']): SimulationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  const startNodes = nodes.filter((n) => n.type === 'start');
  const endNodes = nodes.filter((n) => n.type === 'end');

  if (startNodes.length === 0) errors.push('Workflow must have at least one Start node');
  if (endNodes.length === 0) errors.push('Workflow must have at least one End node');
  if (startNodes.length > 1) warnings.push('Multiple Start nodes detected');

  // Check for orphan nodes
  const connectedIds = new Set<string>();
  edges.forEach((e) => {
    connectedIds.add(e.source);
    connectedIds.add(e.target);
  });

  nodes.forEach((n) => {
    if (!connectedIds.has(n.id) && nodes.length > 1) {
      warnings.push(`Node "${(n.data as Record<string, string>)?.title || n.id}" is disconnected`);
    }
  });

  if (errors.length > 0) {
    return {
      success: false,
      validation: { valid: false, errors, warnings },
      steps: [],
      summary: null,
    };
  }

  // Simple topological execution
  const steps = nodes.map((node, i) => {
    const typeLabels: Record<string, string> = {
      start: 'Initializing workflow',
      task: 'Executing human task',
      approval: 'Waiting for approval',
      automated: 'Running automation',
      end: 'Completing workflow',
    };

    const duration = Math.floor(Math.random() * 3000 + 500);
    const failed = Math.random() < 0.05;

    return {
      nodeId: node.id,
      nodeType: (node.type || 'task') as SimulationResult['steps'][0]['nodeType'],
      title: (node.data as Record<string, string>)?.title || node.type || 'Step',
      action: typeLabels[node.type || 'task'] || 'Processing',
      status: (failed ? 'failed' : 'completed') as 'failed' | 'completed',
      details: failed
        ? `Step "${(node.data as Record<string, string>)?.title}" encountered an error`
        : `Step "${(node.data as Record<string, string>)?.title}" completed successfully`,
      duration,
      startTime: i * 1000,
      endTime: i * 1000 + duration,
    };
  });

  return {
    success: true,
    validation: { valid: true, errors: [], warnings },
    steps,
    summary: {
      totalSteps: steps.length,
      totalDuration: steps.reduce((sum, s) => sum + s.duration, 0),
      completedSteps: steps.filter((s) => s.status === 'completed').length,
      failedSteps: steps.filter((s) => s.status === 'failed').length,
      skippedSteps: 0,
    },
  };
}
