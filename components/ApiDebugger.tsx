'use client';

import { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ApiDebugger() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const testApiConnection = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Test health check
      const healthResponse = await axiosInstance.get('/health');
      console.log('Health check:', healthResponse.data);

      // Test tasks API
      const tasksResponse = await axiosInstance.get('/api/tasks');
      console.log('Tasks API response:', tasksResponse.data);

      setResult({
        health: healthResponse.data,
        tasks: tasksResponse.data,
        tasksType: Array.isArray(tasksResponse.data) ? 'array' : typeof tasksResponse.data,
        tasksLength: Array.isArray(tasksResponse.data) ? tasksResponse.data.length : 'N/A'
      });
    } catch (err: any) {
      console.error('API Test Error:', err);
      setError(err.message || 'API connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>API Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testApiConnection} disabled={loading}>
          {loading ? 'Testing...' : 'Test API Connection'}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Health Check:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(result.health, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold">Tasks API Response:</h3>
              <p className="text-sm text-gray-600">
                Type: {result.tasksType}, Length: {result.tasksLength}
              </p>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(result.tasks, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
