'use client';

import { useState, useEffect } from 'react';
import UploadSection from '@/components/UploadSection';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [healthData, setHealthData] = useState<any>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load existing data from database on mount
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(result => {
        if (result.data && Object.keys(result.data).length > 0) {
          setHealthData(result.data);
          setLastSync(result.lastSync);
        }
      })
      .catch(err => console.error('Failed to load data:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleImport = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/import', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to import data');
    }

    // Reload data after import
    const dataResponse = await fetch('/api/data');
    const result = await dataResponse.json();
    setHealthData(result.data);
    setLastSync(result.lastSync);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-300">Loading your health data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            🍎 Health Tracker
          </h1>
          <p className="text-gray-300 text-lg">
            {lastSync 
              ? `Last synced: ${new Date(lastSync).toLocaleDateString()}`
              : 'Upload your Apple Health export to get started'
            }
          </p>
        </header>

        {!healthData ? (
          <UploadSection onDataImported={handleImport} />
        ) : (
          <>
            <div className="mb-6 text-center">
              <UploadSection onDataImported={handleImport} compact />
            </div>
            <Dashboard data={healthData} onReset={() => setHealthData(null)} />
          </>
        )}
      </div>
    </main>
  );
}
