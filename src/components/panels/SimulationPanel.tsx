/**
 * SimulationPanel — Run workflow simulation and view results
 * Shows validation, step-by-step execution timeline, and summary
 */

'use client';

import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  AlertCircle,
  Zap,
  Flag,
  ClipboardList,
  Loader2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import { SimulationStep } from '@/types/workflow';

interface Props {
  open: boolean;
  onClose: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  start: <Play size={12} />,
  task: <ClipboardList size={12} />,
  approval: <CheckCircle2 size={12} />,
  automated: <Zap size={12} />,
  end: <Flag size={12} />,
};

const typeColors: Record<string, string> = {
  start: '#10b981',
  task: '#3b82f6',
  approval: '#f59e0b',
  automated: '#8b5cf6',
  end: '#f43f5e',
};

const statusColors: Record<string, string> = {
  completed: '#10b981',
  failed: '#ef4444',
  running: '#3b82f6',
  pending: '#9ca3af',
  skipped: '#f59e0b',
};

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function SimulationPanel({ open, onClose }: Props) {
  const { result, loading, error, runSimulation, clearResult } = useSimulation();
  const [showValidation, setShowValidation] = useState(true);

  if (!open) return null;

  return (
    <div className="panel" style={{ borderLeft: '1px solid #e2e5e9' }}>
      {/* Header */}
      <div className="panel-header">
        <div>
          <h3 style={{ margin: 0 }}>Workflow Sandbox</h3>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
            Test & validate your workflow
          </p>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="panel-content">
        {/* Run button */}
        <button
          className="btn btn-primary"
          onClick={runSimulation}
          disabled={loading}
          style={{ width: '100%', marginBottom: 16, padding: '10px 16px' }}
        >
          {loading ? (
            <>
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
              Running Simulation...
            </>
          ) : (
            <>
              <Play size={14} />
              Run Simulation
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: 12,
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 12,
              color: '#991b1b',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="animate-fade-in-up">
            {/* Validation Section */}
            <div style={{ marginBottom: 16 }}>
              <div
                onClick={() => setShowValidation(!showValidation)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  marginBottom: 8,
                }}
              >
                {showValidation ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Validation
                </span>
                {result.validation.valid ? (
                  <CheckCircle2 size={14} color="#10b981" />
                ) : (
                  <XCircle size={14} color="#ef4444" />
                )}
              </div>

              {showValidation && (
                <div style={{ paddingLeft: 20 }}>
                  {result.validation.errors.map((err, i) => (
                    <div
                      key={`err-${i}`}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 6,
                        padding: '6px 0',
                        fontSize: 12,
                        color: '#dc2626',
                      }}
                    >
                      <XCircle size={12} style={{ flexShrink: 0, marginTop: 2 }} />
                      {err}
                    </div>
                  ))}
                  {result.validation.warnings.map((warn, i) => (
                    <div
                      key={`warn-${i}`}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 6,
                        padding: '6px 0',
                        fontSize: 12,
                        color: '#d97706',
                      }}
                    >
                      <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: 2 }} />
                      {warn}
                    </div>
                  ))}
                  {result.validation.valid &&
                    result.validation.errors.length === 0 &&
                    result.validation.warnings.length === 0 && (
                      <p style={{ fontSize: 12, color: '#10b981' }}>
                        ✓ Workflow structure is valid
                      </p>
                    )}
                </div>
              )}
            </div>

            {/* Summary */}
            {result.summary && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    padding: 12,
                    background: '#f0fdf4',
                    borderRadius: 8,
                    border: '1px solid #bbf7d0',
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#15803d' }}>
                    {result.summary.completedSteps}
                  </div>
                  <div style={{ fontSize: 11, color: '#16a34a' }}>Completed</div>
                </div>
                <div
                  style={{
                    padding: 12,
                    background: result.summary.failedSteps > 0 ? '#fef2f2' : '#f8f9fb',
                    borderRadius: 8,
                    border: `1px solid ${result.summary.failedSteps > 0 ? '#fecaca' : '#e2e5e9'}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: result.summary.failedSteps > 0 ? '#dc2626' : '#6b7280',
                    }}
                  >
                    {result.summary.failedSteps}
                  </div>
                  <div style={{ fontSize: 11, color: result.summary.failedSteps > 0 ? '#ef4444' : '#9ca3af' }}>
                    Failed
                  </div>
                </div>
                <div
                  style={{
                    padding: 12,
                    background: '#f8f9fb',
                    borderRadius: 8,
                    border: '1px solid #e2e5e9',
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1d23' }}>
                    {result.summary.totalSteps}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>Total Steps</div>
                </div>
                <div
                  style={{
                    padding: 12,
                    background: '#f8f9fb',
                    borderRadius: 8,
                    border: '1px solid #e2e5e9',
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1d23' }}>
                    {formatDuration(result.summary.totalDuration)}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>Total Time</div>
                </div>
              </div>
            )}

            {/* Timeline */}
            {result.steps.length > 0 && (
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
                  Execution Timeline
                </h4>
                <div className="simulation-timeline">
                  {result.steps.map((step: SimulationStep, index: number) => (
                    <div className="timeline-step" key={`${step.nodeId}-${index}`}>
                      <div className={`step-dot dot-${step.status}`} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            background: typeColors[step.nodeType] || '#6b7280',
                            color: 'white',
                          }}
                        >
                          {typeIcons[step.nodeType]}
                        </span>
                        <span className="step-title">{step.title}</span>
                        <span
                          style={{
                            fontSize: 10,
                            padding: '1px 6px',
                            borderRadius: 999,
                            background: step.status === 'completed' ? '#dcfce7' : step.status === 'failed' ? '#fee2e2' : '#f3f4f6',
                            color: statusColors[step.status],
                            fontWeight: 500,
                          }}
                        >
                          {step.status}
                        </span>
                      </div>
                      <div className="step-detail">{step.details}</div>
                      <div className="step-meta">
                        <span>
                          <Clock size={10} />
                          {formatDuration(step.duration)}
                        </span>
                        <span style={{ color: typeColors[step.nodeType] }}>
                          {step.nodeType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clear results */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={clearResult}
              style={{ marginTop: 16, width: '100%' }}
            >
              Clear Results
            </button>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#9ca3af',
            }}
          >
            <Zap size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: 14, fontWeight: 500, color: '#6b7280' }}>
              Ready to test
            </p>
            <p style={{ fontSize: 12, marginTop: 4 }}>
              Click &quot;Run Simulation&quot; to validate and test your workflow step by step.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
