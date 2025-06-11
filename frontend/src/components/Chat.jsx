import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, FileText, Bot, User, Clock, CheckCircle } from 'lucide-react';
import { sendGeneralMessage, sendDocumentQuestion } from '../lib/api';

const Chat = () => {
  const [mode, setMode] = useState('general'); // 'general' or 'docs'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      mode
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let response;
      if (mode === 'general') {
        // Convert messages to history format for general chat
        const history = messages
          .filter(msg => msg.mode === 'general')
          .map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          }));
        
        response = await sendGeneralMessage(input, history);
        
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
          mode: 'general'
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        response = await sendDocumentQuestion(input);
        
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.answer,
          sources: response.sources || [],
          timestamp: new Date(),
          mode: 'docs',
          documentsFound: response.documentsFound
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = 'Sorry, there was an error processing your request. Please try again.';
      
      // Check if it's an API error with specific message
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
        mode,
        error: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800">
            Document Q&A Chatbot
          </h1>
        </div>
        <button
          onClick={clearChat}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
        >
          Clear Chat
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="flex p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex rounded-lg bg-white p-1 border">
          <button
            onClick={() => setMode('general')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              mode === 'general'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>General Chat</span>
          </button>
          <button
            onClick={() => setMode('docs')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              mode === 'docs'
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Document Q&A</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              {mode === 'general' ? (
                <MessageCircle className="w-8 h-8 text-gray-400" />
              ) : (
                <FileText className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <p className="text-lg font-medium mb-2">
              {mode === 'general' ? 'Start a conversation' : 'Ask about documents'}
            </p>
            <p className="text-sm">
              {mode === 'general' 
                ? 'Ask me anything and I\'ll help you!'
                : 'I can answer questions based on the uploaded documents.'
              }
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.error
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-1">
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Sources for document Q&A */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        Sources ({message.documentsFound} docs found):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {message.sources.map((source, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex items-center mt-1 text-xs ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-gray-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'general' 
                ? 'Type your message...' 
                : 'Ask a question about the documents...'
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`px-4 py-2 rounded-lg transition-colors ${
              loading || !input.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : mode === 'general'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 