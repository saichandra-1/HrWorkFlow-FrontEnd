/**
 * API layer for communicating with the backend server
 * Base URL is configurable via NEXT_PUBLIC_API_URL environment variable
 */

import {
  AutomationAction,
  SimulationResult,
  WorkflowTemplate,
  WorkflowTemplateDetail,
} from '@/types/workflow';
import { Node, Edge } from '@xyflow/react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(error.error || `API request failed: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'Cannot connect to the backend server. Make sure the backend is running on ' + API_BASE
      );
    }
    throw error;
  }
}

// ---- Automations API ----

export async function fetchAutomations(): Promise<AutomationAction[]> {
  const res = await apiFetch<{ success: boolean; data: AutomationAction[] }>('/automations');
  return res.data;
}

export async function fetchAutomation(id: string): Promise<AutomationAction> {
  const res = await apiFetch<{ success: boolean; data: AutomationAction }>(
    `/automations/${id}`
  );
  return res.data;
}

// ---- Simulation API ----

export async function simulateWorkflow(
  nodes: Node[],
  edges: Edge[]
): Promise<SimulationResult> {
  // Map nodes to the shape the backend expects
  const payload = {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    })),
  };

  return apiFetch<SimulationResult>('/simulate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function validateWorkflow(
  nodes: Node[],
  edges: Edge[]
): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
  const payload = {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    })),
  };

  return apiFetch('/simulate/validate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ---- Templates API ----

export async function fetchTemplates(): Promise<WorkflowTemplate[]> {
  const res = await apiFetch<{ success: boolean; data: WorkflowTemplate[] }>('/templates');
  return res.data;
}

export async function fetchTemplate(id: string): Promise<WorkflowTemplateDetail> {
  const res = await apiFetch<{ success: boolean; data: WorkflowTemplateDetail }>(
    `/templates/${id}`
  );
  return res.data;
}

// ---- Health Check ----

export async function checkHealth(): Promise<boolean> {
  try {
    await apiFetch('/health');
    return true;
  } catch {
    return false;
  }
}
