import React, { useState, useEffect } from 'react';
import { FileText, Server, Check, X, RefreshCw, Upload, Plus } from 'lucide-react';
import { getDocuments, checkHealth } from '../lib/api';
import FileUpload from './FileUpload';

const Sidebar = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState('checking');
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDocuments();
      setDocuments(response.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const checkServerStatus = async () => {
    try {
      await checkHealth();
      setServerStatus('online');
    } catch (error) {
      setServerStatus('offline');
    }
  };

  const handleUploadSuccess = (uploadedFile) => {
    // Refresh documents list after successful upload
    fetchDocuments();
    // Hide upload form
    setShowUpload(false);
  };

  useEffect(() => {
    fetchDocuments();
    checkServerStatus();
    
    // Check server status every 30 seconds
    const statusInterval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(statusInterval);
  }, []);

  const getStatusIcon = () => {
    switch (serverStatus) {
      case 'online':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'offline':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (serverStatus) {
      case 'online':
        return 'Server Online';
      case 'offline':
        return 'Server Offline';
      default:
        return 'Checking...';
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">System Status</h2>
        
        {/* Server Status */}
        <div className="flex items-center space-x-2 mb-4">
          <Server className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Backend:</span>
          <div className="flex items-center space-x-1">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${
              serverStatus === 'online' ? 'text-green-600' :
              serverStatus === 'offline' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-md font-medium text-gray-800">Available Documents</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className={`p-1 rounded transition-colors ${
                showUpload ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Upload document"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={fetchDocuments}
              disabled={loading}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              title="Refresh documents"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-800">Upload Document</h4>
            <button
              onClick={() => setShowUpload(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      )}

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-gray-400 animate-spin mr-2" />
              <span className="text-gray-500">Loading documents...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <X className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
              <button
                onClick={fetchDocuments}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-4 text-center">
            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No documents available</p>
            <p className="text-gray-400 text-xs mt-1">
              Upload .txt files to get started
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Upload your first document
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-3">
                      {doc.preview}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Documents:</span>
            <span className="font-medium">{documents.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Mode:</span>
            <span className="font-medium">Q&A Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 