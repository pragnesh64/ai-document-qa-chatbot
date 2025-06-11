const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// General chat with AI
async function getChatResponse(message, conversationHistory = []) {
  try {
    const messages = [
      { role: "system", content: "You are a helpful AI assistant. Provide clear and concise answers." },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error getting chat response:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 429) {
      throw new Error('OpenAI API quota exceeded. Please check your billing details at https://platform.openai.com/account/billing');
    } else if (error.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your API key in the .env file.');
    } else if (error.status === 500) {
      throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
    } else {
      throw new Error(`OpenAI API error: ${error.message || 'Unknown error'}`);
    }
  }
}

// Document-based Q&A
async function getDocumentQAResponse(question, documents) {
  try {
    // Prepare context from documents
    const contextText = documents.map(doc => 
      `From ${doc.name}:\n${doc.content.slice(0, 1500)}`
    ).join('\n\n');

    const prompt = `Based on the following documents, answer the question. If the answer is not found in the documents, say "I couldn't find that information in the provided documents."

Documents:
${contextText}

Question: ${question}

Answer:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that answers questions based only on the provided documents. Be accurate and cite sources when possible." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 800,
    });

    return {
      answer: completion.choices[0].message.content,
      sources: documents.map(doc => doc.name)
    };
  } catch (error) {
    console.error('Error getting document QA response:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 429) {
      throw new Error('OpenAI API quota exceeded. Please check your billing details at https://platform.openai.com/account/billing');
    } else if (error.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your API key in the .env file.');
    } else if (error.status === 500) {
      throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
    } else {
      throw new Error(`OpenAI API error: ${error.message || 'Unknown error'}`);
    }
  }
}

module.exports = {
  getChatResponse,
  getDocumentQAResponse
}; 