const fs = require('fs');
const path = require('path');

const documentsPath = path.join(__dirname, '../data');

// Get all documents from the data folder
function getAllDocuments() {
  try {
    const files = fs.readdirSync(documentsPath);
    return files
      .filter(file => file.endsWith('.txt'))
      .map(file => ({
        name: file,
        content: fs.readFileSync(path.join(documentsPath, file), 'utf-8')
      }));
  } catch (error) {
    console.error('Error reading documents:', error);
    return [];
  }
}

// Enhanced search documents based on query
function searchDocuments(query) {
  const docs = getAllDocuments();
  const searchTerm = query.toLowerCase();
  
  // Enhanced search logic
  return docs.filter(doc => {
    const docContent = doc.content.toLowerCase();
    const docName = doc.name.toLowerCase();
    
    // Direct content or filename match
    if (docContent.includes(searchTerm) || docName.includes(searchTerm)) {
      return true;
    }
    
    // Keyword-based search for better matching
    const keywords = extractKeywords(searchTerm);
    const docKeywords = extractKeywords(docContent);
    
    // Check if any search keywords match document keywords
    return keywords.some(keyword => 
      docKeywords.some(docKeyword => 
        docKeyword.includes(keyword) || keyword.includes(docKeyword)
      )
    );
  });
}

// Extract meaningful keywords from text
function extractKeywords(text) {
  // Remove common stop words and extract meaningful terms
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'what', 'are', 'is', 'how', 'why', 'when', 'where'];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
}

// Smart document finder - returns relevant docs even for general queries
function findRelevantDocuments(query) {
  const docs = getAllDocuments();
  const searchTerm = query.toLowerCase();
  
  // Topic-based matching
  const topicMap = {
    'animal': ['animals.txt'],
    'react': ['react.txt'],
    'india': ['india.txt'],
    'javascript': ['react.txt'],
    'programming': ['react.txt'],
    'country': ['india.txt'],
    'nation': ['india.txt'],
    'mammal': ['animals.txt'],
    'bird': ['animals.txt'],
    'characteristics': ['animals.txt', 'react.txt', 'india.txt'], // Generic - search all
    'feature': ['animals.txt', 'react.txt', 'india.txt']
  };
  
  // Find topic matches
  const relevantFiles = new Set();
  
  for (const [topic, files] of Object.entries(topicMap)) {
    if (searchTerm.includes(topic)) {
      files.forEach(file => relevantFiles.add(file));
    }
  }
  
  // If we found topic matches, return those documents
  if (relevantFiles.size > 0) {
    return docs.filter(doc => relevantFiles.has(doc.name));
  }
  
  // Fallback to regular search
  return searchDocuments(query);
}

// Get document by name
function getDocumentByName(filename) {
  try {
    const filePath = path.join(documentsPath, filename);
    if (fs.existsSync(filePath)) {
      return {
        name: filename,
        content: fs.readFileSync(filePath, 'utf-8')
      };
    }
    return null;
  } catch (error) {
    console.error('Error reading document:', error);
    return null;
  }
}

module.exports = {
  getAllDocuments,
  searchDocuments,
  findRelevantDocuments,
  getDocumentByName
}; 