'use client';

import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with React Flow
const WorkflowDesigner = dynamic(
  () => import('@/components/WorkflowDesigner'),
  { ssr: false }
);

export default function Home() {
  return <WorkflowDesigner />;
}
