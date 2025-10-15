'use client';

import ApiDebugger from '@/components/ApiDebugger';
import TaskStatusTester from '@/components/TaskStatusTester';

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">API Debug Page</h1>
        <ApiDebugger />
        <TaskStatusTester />
      </div>
    </div>
  );
}
