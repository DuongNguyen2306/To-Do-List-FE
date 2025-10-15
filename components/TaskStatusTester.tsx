'use client';

import React, { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TaskStatusTester() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const testTaskUpdate = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // First, get all tasks
      const tasksResponse = await axiosInstance.get('/api/tasks');
      console.log('Tasks response:', tasksResponse.data);
      
      if (!Array.isArray(tasksResponse.data) || tasksResponse.data.length === 0) {
        throw new Error('No tasks found to test with');
      }

      const firstTask = tasksResponse.data[0];
      console.log('First task:', firstTask);

      // Test updating the first task
      const updateData = {
        title: firstTask.title,
        description: firstTask.description || '',
        status: firstTask.status === 'To do' ? 'In progress' : 'To do',
        priority: firstTask.priority || 'medium',
        project: firstTask.project || '',
        tags: firstTask.tags || [],
        dueDate: firstTask.dueDate || '',
        reminderAt: firstTask.reminderAt || ''
      };

      console.log('Updating task with data:', updateData);

      const updateResponse = await axiosInstance.put(`/api/tasks/${firstTask._id}`, updateData);
      console.log('Update response:', updateResponse.data);

      setResult({
        originalTask: firstTask,
        updateData: updateData,
        updatedTask: updateResponse.data
      });

    } catch (err: any) {
      console.error('Test Error:', err);
      setError(err.message || 'Test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Task Status Update Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testTaskUpdate} disabled={loading}>
          {loading ? 'Testing...' : 'Test Task Status Update'}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Original Task:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(result.originalTask, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold">Update Data Sent:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(result.updateData, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold">Updated Task Response:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(result.updatedTask, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
