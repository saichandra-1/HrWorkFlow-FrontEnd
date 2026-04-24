/**
 * Node Registry — Maps node types to their React components
 */

import StartNode from './StartNode';
import TaskNode from './TaskNode';
import ApprovalNode from './ApprovalNode';
import AutomatedNode from './AutomatedNode';
import EndNode from './EndNode';
import { NodeTypes } from '@xyflow/react';

export const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

export { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode };
