const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getChatResponse, getDocumentQAResponse } = require('../utils/openai');
const { findRelevantDocuments, getAllDocuments } = require('../utils/documents');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dataDir = path.join(__dirname, '../data');
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    cb(null, dataDir);
  },
  filename: function (req, file, cb) {
    // Keep original filename but ensure it's .txt
    const originalName = file.originalname;
    const fileName = originalName.endsWith('.txt') ? originalName : `${originalName}.txt`;
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only .txt files
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// File upload endpoint
router.post('/upload', upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get file info
    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: req.file.path
    };

    console.log('File uploaded successfully:', fileInfo);

    res.json({
      message: 'File uploaded successfully!',
      file: {
        name: fileInfo.filename,
        originalName: fileInfo.originalName,
        size: fileInfo.size
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// General chat endpoint
router.post('/general', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await getChatResponse(message, history || []);
    
    res.json({
      response,
      type: 'general'
    });
  } catch (error) {
    console.error('Error in general chat:', error);
    
    // Send specific error message to frontend
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      type: 'openai_error'
    });
  }
});

// Document Q&A endpoint
router.post('/docs-qa', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Use improved search for relevant documents
    const matchedDocs = findRelevantDocuments(question);
    
    console.log(`Query: "${question}" found ${matchedDocs.length} documents:`, matchedDocs.map(d => d.name));
    
    if (matchedDocs.length === 0) {
      return res.json({
        answer: "I couldn't find any relevant documents for your question. Please try a different query or check if documents are available.",
        sources: [],
        type: 'docs-qa'
      });
    }

    const qaResponse = await getDocumentQAResponse(question, matchedDocs);
    
    res.json({
      answer: qaResponse.answer,
      sources: qaResponse.sources,
      type: 'docs-qa',
      documentsFound: matchedDocs.length
    });
  } catch (error) {
    console.error('Error in document Q&A:', error);
    
    // Send specific error message to frontend
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      type: 'openai_error'
    });
  }
});

// Get all available documents
router.get('/documents', async (req, res) => {
  try {
    const documents = getAllDocuments();
    const documentList = documents.map(doc => ({
      name: doc.name,
      preview: doc.content.slice(0, 200) + '...'
    }));
    
    res.json({
      documents: documentList,
      total: documents.length
    });
  } catch (error) {
    console.error('Error getting documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 