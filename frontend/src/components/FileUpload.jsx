import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle, X, AlertCircle } from 'lucide-react';
import { uploadDocument } from '../lib/api';

const FileUpload = ({ onUploadSuccess }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.txt') && file.type !== 'text/plain') {
      setUploadStatus('error');
      setStatusMessage('Please select a .txt file only.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      setStatusMessage('File size must be less than 5MB.');
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadStatus(null);
    setStatusMessage('');

    try {
      const response = await uploadDocument(file);
      setUploadStatus('success');
      setStatusMessage(`"${response.file.name}" uploaded successfully!`);
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(response.file);
      }
    } catch (error) {
      setUploadStatus('error');
      const errorMsg = error.response?.data?.error || 'Failed to upload file. Please try again.';
      setStatusMessage(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
    // Clear the input so the same file can be selected again
    e.target.value = '';
  };

  const clearStatus = () => {
    setUploadStatus(null);
    setStatusMessage('');
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".txt,text/plain"
          className="hidden"
          disabled={uploading}
        />

        <div className="flex flex-col items-center space-y-2">
          {uploading ? (
            <>
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {isDragOver ? 'Drop your file here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  .txt files only, up to 5MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status Message */}
      {uploadStatus && (
        <div className={`mt-3 p-3 rounded-lg flex items-center justify-between ${
          uploadStatus === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {uploadStatus === 'success' ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <p className={`text-sm ${
              uploadStatus === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {statusMessage}
            </p>
          </div>
          <button
            onClick={clearStatus}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 