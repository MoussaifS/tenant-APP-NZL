'use client';

import { useState, useEffect } from 'react';
import { testBackendConnection, getApiConfig } from '@/lib/apiUtils';

export default function ConnectionTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    setConfig(getApiConfig());
  }, []);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const connected = await testBackendConnection();
      setIsConnected(connected);
    } catch (error) {
      console.error('Connection test failed:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Backend Connection Test</h3>
      
      {config && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">Current Configuration:</h4>
          <ul className="text-sm space-y-1">
            <li><strong>Backend URL:</strong> {config.STRAPI_URL}</li>
            <li><strong>API Base Path:</strong> {config.API_BASE_PATH}</li>
            <li><strong>Full API URL:</strong> {config.FULL_API_URL}</li>
            <li><strong>Timeout:</strong> {config.API_TIMEOUT}ms</li>
            <li><strong>Debug Mode:</strong> {config.DEBUG_MODE ? 'Enabled' : 'Disabled'}</li>
          </ul>
        </div>
      )}

      <button
        onClick={testConnection}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Connection'}
      </button>

      {isConnected !== null && (
        <div className={`mt-4 p-3 rounded ${
          isConnected ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {isConnected ? (
            <div>
              ✅ <strong>Connection Successful!</strong>
              <p className="text-sm mt-1">Backend is reachable and responding correctly.</p>
            </div>
          ) : (
            <div>
              ❌ <strong>Connection Failed!</strong>
              <p className="text-sm mt-1">Unable to connect to the backend. Check your configuration and ensure the backend is running.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
