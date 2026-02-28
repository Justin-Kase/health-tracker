'use client';

import { useState } from 'react';

interface UploadSectionProps {
  onDataImported: (file: File) => Promise<void>;
  compact?: boolean;
}

export default function UploadSection({ onDataImported, compact }: UploadSectionProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      await onDataImported(file);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import file');
    } finally {
      setIsProcessing(false);
    }
  };

  if (compact) {
    return (
      <div className="inline-block">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".xml"
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="hidden"
          />
          <div className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isProcessing 
              ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
              : success
              ? 'bg-green-500 text-white'
              : 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/50'
          }`}>
            {isProcessing ? '⏳ Importing...' : success ? '✅ Imported!' : '📤 Upload New Export'}
          </div>
        </label>
        {error && (
          <p className="text-red-300 text-sm mt-2">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-white mb-2">Upload Your Health Data</h2>
          <p className="text-gray-400">
            Export your data from the Apple Health app and upload the export.xml file
          </p>
        </div>

        <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <h3 className="font-semibold text-purple-300 mb-2">How to export:</h3>
          <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
            <li>Open the Health app on your iPhone</li>
            <li>Tap your profile picture (top right)</li>
            <li>Scroll down and tap "Export All Health Data"</li>
            <li>Save the export.zip file</li>
            <li>Unzip it and upload the export.xml file here</li>
          </ol>
        </div>

        <label className="block">
          <input
            type="file"
            accept=".xml"
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-3 file:px-6
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-500 file:text-white
              hover:file:bg-purple-600
              file:cursor-pointer cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </label>

        {isProcessing && (
          <div className="mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="text-gray-400 mt-2">Importing your health data to database...</p>
          </div>
        )}

        {success && (
          <div className="mt-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
            <p className="text-green-300 text-sm">✅ Data imported successfully!</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
