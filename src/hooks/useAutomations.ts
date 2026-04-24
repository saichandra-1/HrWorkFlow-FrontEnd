/**
 * Custom hook to fetch and cache automation actions from the API
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { AutomationAction } from '@/types/workflow';
import { fetchAutomations } from '@/lib/api';

interface UseAutomationsReturn {
  automations: AutomationAction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAutomations(): UseAutomationsReturn {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAutomations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAutomations();
      setAutomations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load automations');
      // Set fallback data so the app still works without backend
      setAutomations([
        { id: 'send_email', label: 'Send Email', description: 'Send an automated email', icon: 'mail', params: ['to', 'subject', 'body'] },
        { id: 'generate_doc', label: 'Generate Document', description: 'Generate a document', icon: 'file-text', params: ['template', 'recipient', 'format'] },
        { id: 'send_slack', label: 'Send Slack Message', description: 'Post to Slack', icon: 'message-square', params: ['channel', 'message'] },
        { id: 'create_ticket', label: 'Create JIRA Ticket', description: 'Create a JIRA ticket', icon: 'ticket', params: ['project', 'summary', 'priority', 'assignee'] },
        { id: 'update_hris', label: 'Update HRIS Record', description: 'Update HRIS', icon: 'database', params: ['employeeId', 'field', 'value'] },
        { id: 'schedule_meeting', label: 'Schedule Meeting', description: 'Schedule a meeting', icon: 'calendar', params: ['attendees', 'date', 'time', 'agenda'] },
        { id: 'run_background_check', label: 'Run Background Check', description: 'Background check', icon: 'shield-check', params: ['candidateId', 'checkLevel'] },
        { id: 'provision_accounts', label: 'Provision Accounts', description: 'Create accounts', icon: 'user-plus', params: ['employeeId', 'systems', 'role'] },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAutomations();
  }, [loadAutomations]);

  return {
    automations,
    loading,
    error,
    refetch: loadAutomations,
  };
}
