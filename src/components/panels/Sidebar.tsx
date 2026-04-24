/**
 * Sidebar — App navigation + draggable node palette + templates
 * Collapsible with toggle button
 */

'use client';

import React, { useState, useEffect, DragEvent } from 'react';
import {
  Play,
  ClipboardList,
  CheckCircle,
  Zap,
  Flag,
  Workflow,
  Upload,
  Download,
  Trash2,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
} from 'lucide-react';
import { NODE_TYPE_CONFIGS, WorkflowNodeType, WorkflowTemplate } from '@/types/workflow';
import { useWorkflowStore } from '@/store/workflowStore';
import { fetchTemplates, fetchTemplate } from '@/lib/api';

const nodeIcons: Record<WorkflowNodeType, React.ReactNode> = {
  start: <Play size={16} />,
  task: <ClipboardList size={16} />,
  approval: <CheckCircle size={16} />,
  automated: <Zap size={16} />,
  end: <Flag size={16} />,
};

interface Props {
  onDragStart: (event: DragEvent, nodeType: WorkflowNodeType) => void;
  onToggleSidebar?: () => void;
}

export default function Sidebar({ onDragStart, onToggleSidebar }: Props) {
  const { exportWorkflow, importWorkflow, clearWorkflow, nodes } = useWorkflowStore();
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(true);
  const [showNodes, setShowNodes] = useState(true);

  useEffect(() => {
    fetchTemplates()
      .then(setTemplates)
      .catch(() => {
        setTemplates([
          { id: 'onboarding', name: 'Employee Onboarding', description: 'Standard new employee onboarding workflow', nodeCount: 7, edgeCount: 6 },
          { id: 'leave-approval', name: 'Leave Approval', description: 'Employee leave request and approval workflow', nodeCount: 6, edgeCount: 5 },
          { id: 'document-verification', name: 'Document Verification', description: 'Verify and process employee documents', nodeCount: 6, edgeCount: 5 },
        ]);
      });
  }, []);

  const handleLoadTemplate = async (templateId: string) => {
    try {
      const template = await fetchTemplate(templateId);
      importWorkflow({
        nodes: template.nodes.map((n) => ({
          id: n.id,
          type: n.type,
          position: n.position,
          data: n.data as unknown as Record<string, unknown>,
        })),
        edges: template.edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
        })),
      });
    } catch {
      console.error('Failed to load template');
    }
  };

  const handleExport = () => {
    const data = exportWorkflow();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.nodes && data.edges) {
            importWorkflow(data);
          }
        } catch {
          console.error('Invalid workflow JSON');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <aside className="sidebar">
      {/* Logo + Collapse Button */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Workflow size={18} color="white" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="logo-text">WorkflowHR</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
            Workflow Designer
          </div>
        </div>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            title="Collapse Sidebar"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            <ChevronsLeft size={16} />
          </button>
        )}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
        {/* Node Palette */}
        <div className="sidebar-section">
          <div
            onClick={() => setShowNodes(!showNodes)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '0 8px',
              marginBottom: 8,
            }}
          >
            <span className="sidebar-section-title" style={{ margin: 0 }}>
              Node Types
            </span>
            {showNodes ? (
              <ChevronDown size={12} color="rgba(255,255,255,0.3)" />
            ) : (
              <ChevronRight size={12} color="rgba(255,255,255,0.3)" />
            )}
          </div>

          {showNodes &&
            Object.values(NODE_TYPE_CONFIGS).map((config) => (
              <div
                key={config.type}
                className="sidebar-node-item"
                draggable
                onDragStart={(e) => onDragStart(e, config.type)}
              >
                <div className="item-icon" style={{ background: config.color }}>
                  {nodeIcons[config.type]}
                </div>
                <div>
                  <div className="item-label">{config.label}</div>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.3)',
                      marginTop: 1,
                    }}
                  >
                    {config.description}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Templates */}
        <div className="sidebar-section">
          <div
            onClick={() => setShowTemplates(!showTemplates)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '0 8px',
              marginBottom: 8,
            }}
          >
            <span className="sidebar-section-title" style={{ margin: 0 }}>
              Templates
            </span>
            {showTemplates ? (
              <ChevronDown size={12} color="rgba(255,255,255,0.3)" />
            ) : (
              <ChevronRight size={12} color="rgba(255,255,255,0.3)" />
            )}
          </div>

          {showTemplates &&
            templates.map((template) => (
              <div
                key={template.id}
                className="template-card"
                onClick={() => handleLoadTemplate(template.id)}
              >
                <div className="template-name">{template.name}</div>
                <div className="template-desc">{template.description}</div>
                <div className="template-meta">
                  <span>{template.nodeCount} nodes</span>
                  <span>{template.edgeCount} edges</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Bottom action buttons — always visible, not scrollable */}
      <div
        style={{
          padding: '8px 10px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          gap: 6,
          flexShrink: 0,
        }}
      >
        <button
          onClick={handleImport}
          title="Import JSON"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            padding: '7px 0',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            fontSize: 11,
            fontFamily: 'inherit',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
          }}
        >
          <Upload size={12} />
          Import
        </button>

        <button
          onClick={handleExport}
          disabled={nodes.length === 0}
          title="Export JSON"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            padding: '7px 0',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.6)',
            cursor: nodes.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: 11,
            fontFamily: 'inherit',
            opacity: nodes.length === 0 ? 0.4 : 1,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (nodes.length > 0) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'white';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
          }}
        >
          <Download size={12} />
          Export
        </button>

        <button
          onClick={clearWorkflow}
          disabled={nodes.length === 0}
          title="Clear Canvas"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 6,
            border: '1px solid rgba(239,68,68,0.2)',
            background: 'rgba(239,68,68,0.08)',
            color: '#f87171',
            cursor: nodes.length === 0 ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            opacity: nodes.length === 0 ? 0.4 : 1,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (nodes.length > 0) {
              e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </aside>
  );
}
