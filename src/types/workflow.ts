/**
 * Core TypeScript types for the HR Workflow Designer
 */

// ---- Node Data Types ----

export interface StartNodeData {
  title: string;
  metadata: Record<string, string>;
}

export interface TaskNodeData {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
}

export interface ApprovalNodeData {
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData {
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData {
  endMessage: string;
  showSummary: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type WorkflowNodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

// ---- Node Default Data Factories ----

export const createDefaultNodeData = (type: WorkflowNodeType): WorkflowNodeData => {
  switch (type) {
    case 'start':
      return { title: 'Start', metadata: {} };
    case 'task':
      return { title: 'New Task', description: '', assignee: '', dueDate: '', customFields: {} };
    case 'approval':
      return { title: 'Approval', approverRole: 'Manager', autoApproveThreshold: 3 };
    case 'automated':
      return { title: 'Automated Step', actionId: '', actionParams: {} };
    case 'end':
      return { title: 'End', endMessage: 'Workflow completed', showSummary: true };
    default:
      return { title: 'Unknown', metadata: {} };
  }
};

// ---- Node Display Config ----

export interface NodeTypeConfig {
  type: WorkflowNodeType;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
}

export const NODE_TYPE_CONFIGS: Record<WorkflowNodeType, NodeTypeConfig> = {
  start: {
    type: 'start',
    label: 'Start Node',
    description: 'Workflow entry point',
    color: '#10b981',
    bgColor: '#dcfce7',
    icon: 'play',
  },
  task: {
    type: 'task',
    label: 'Task Node',
    description: 'Human task step',
    color: '#3b82f6',
    bgColor: '#dbeafe',
    icon: 'clipboard-list',
  },
  approval: {
    type: 'approval',
    label: 'Approval Node',
    description: 'Manager/HR approval',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    icon: 'check-circle',
  },
  automated: {
    type: 'automated',
    label: 'Automated Step',
    description: 'System-triggered action',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
    icon: 'zap',
  },
  end: {
    type: 'end',
    label: 'End Node',
    description: 'Workflow completion',
    color: '#f43f5e',
    bgColor: '#ffe4e6',
    icon: 'flag',
  },
};

// ---- Automation Types ----

export interface AutomationAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  params: string[];
}

// ---- Template Types ----

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  nodeCount: number;
  edgeCount: number;
}

export interface WorkflowTemplateDetail extends WorkflowTemplate {
  nodes: Array<{
    id: string;
    type: WorkflowNodeType;
    position: { x: number; y: number };
    data: WorkflowNodeData;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
}

// ---- Simulation Types ----

export interface SimulationStep {
  nodeId: string;
  nodeType: WorkflowNodeType;
  title: string;
  action: string;
  status: 'completed' | 'failed' | 'skipped' | 'running' | 'pending';
  details: string;
  duration: number;
  startTime: number;
  endTime: number;
}

export interface SimulationSummary {
  totalSteps: number;
  totalDuration: number;
  completedSteps: number;
  failedSteps: number;
  skippedSteps: number;
}

export interface SimulationResult {
  success: boolean;
  validation: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
  steps: SimulationStep[];
  summary: SimulationSummary | null;
}

// ---- Validation Types ----

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
