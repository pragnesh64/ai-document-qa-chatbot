import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// General chat API call
export const sendGeneralMessage = async (message, history = []) => {
  try {
    const response = await api.post('/chat/general', {
      message,
      history
    });
    return response.data;
  } catch (error) {
    console.error('Error sending general message:', error);
    throw error;
  }
};

// Document Q&A API call
export const sendDocumentQuestion = async (question) => {
  try {
    const response = await api.post('/chat/docs-qa', {
      question
    });
    return response.data;
  } catch (error) {
    console.error('Error sending document question:', error);
    throw error;
  }
};

// Get available documents
export const getDocuments = async () => {
  try {
    const response = await api.get('/chat/documents');
    return response.data;
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

// Upload document file
export const uploadDocument = async (file) => {
  try {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await axios.post(`${API_BASE_URL}/chat/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
}; 