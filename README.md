# 🤖 AI Document Q&A Chatbot

A modern, full-stack AI chatbot application that provides both **general conversational AI** and **document-based Q&A** functionality. Built with React frontend and Express.js backend, featuring a clean, responsive UI and real-time chat capabilities.

## 📸 Demo Screenshot

![AI Chatbot Demo](./image.png)
*Main chat interface showing both general AI chat and document Q&A modes*

## ✨ Features

### 🧠 **Dual AI Modes**
- **General Chat**: Engage in natural conversations with OpenAI's GPT-3.5-turbo
- **Document Q&A**: Ask questions about pre-loaded documents with intelligent context understanding

### 🎨 **Modern UI/UX**
- Beautiful, responsive chat interface built with React and Tailwind CSS
- Real-time message streaming
- Clean, intuitive design with smooth animations
- Mobile-friendly responsive layout

### 📚 **Document Management**
- Support for multiple text documents
- Real-time document availability display
- Easy document addition by placing files in data folder
- Automatic document indexing and processing

### 🔧 **Technical Features**
- Separate frontend and backend architecture
- RESTful API design
- CORS-enabled cross-origin requests
- Environment-based configuration
- Error handling and logging
- Health check endpoints

## 🏗️ Architecture & Project Structure

```
ai-chatbot/
├── 📁 frontend/                    # React + Vite frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/          # React components
│   │   │   ├── ChatInterface.jsx   # Main chat UI
│   │   │   ├── MessageBubble.jsx   # Chat message display
│   │   │   └── Sidebar.jsx         # Document list sidebar
│   │   ├── 📁 lib/                 # Utility libraries
│   │   │   └── api.js              # API communication layer
│   │   ├── 📁 styles/              # CSS and styling
│   │   └── App.jsx                 # Main application component
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   └── tailwind.config.js          # Tailwind CSS config
├── 📁 backend/                     # Express.js backend API
│   ├── 📁 config/                  # Configuration files
│   ├── 📁 data/                    # Document storage directory
│   │   ├── react.txt               # Sample React documentation
│   │   ├── india.txt               # Sample India information
│   │   ├── animals.txt             # Sample animal facts
│   │   └── [your-documents].txt    # Add your own documents here
│   ├── 📁 routes/                  # API route handlers
│   │   └── chat.js                 # Chat and Q&A endpoints
│   ├── 📁 utils/                   # Utility functions
│   ├── 📁 middleware/              # Express middleware
│   ├── server.js                   # Main server file
│   └── package.json                # Backend dependencies
├── start-backend.sh                # Backend startup script
├── start-frontend.sh               # Frontend startup script
└── README.md                       # This file
```

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **OpenAI API Key** - [Get yours here](https://platform.openai.com/api-keys)

### 1. 📥 Clone & Setup

```bash
# Clone the repository
git clone <your-repository-url>
cd ai-chatbot

# Or if you downloaded the zip file
cd ai-chatbot
```

### 2. 🔧 Backend Configuration

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp ../env.example .env
```

**Configure your environment variables** in `backend/.env`:

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: Add your organization ID if you have one
OPENAI_ORG_ID=your-org-id-here
```

**Start the backend server:**

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

✅ **Backend will be running at:** `http://localhost:5000`

### 3. 🎨 Frontend Setup

Open a new terminal window/tab:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ **Frontend will be running at:** `http://localhost:3000`

### 4. 🚀 Access the Application

Open your browser and navigate to:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

## 📚 Adding Your Own Documents

1. **Place text files** in the `backend/data/` directory
2. **Supported formats:** `.txt` files (PDF support coming soon)
3. **File naming:** Use descriptive names (e.g., `company-policies.txt`, `product-manual.txt`)
4. **Content:** Plain text content works best
5. **Restart:** Restart the backend server to load new documents

**Example documents included:**
- `react.txt` - React framework information
- `india.txt` - Information about India
- `animals.txt` - Animal facts and information
- `AI_Tools.txt` - AI tools overview
- `Programming_Languages.txt` - Programming language comparisons

## 🎯 Usage Guide

### General Chat Mode
1. Click on **"General Chat"** button
2. Ask any general questions to the AI
3. Get responses powered by GPT-3.5-turbo

### Document Q&A Mode
1. Click on **"Document Q&A"** button
2. Ask questions about the loaded documents
3. Get contextual answers based on document content
4. View available documents in the sidebar

### Features Overview
- **Real-time chat** with instant responses
- **Toggle between modes** seamlessly
- **View document status** and availability
- **Responsive design** works on all devices
- **Message history** within the session

## 🔌 API Documentation

### Base URL: `http://localhost:5000/api`

#### Chat Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/chat/general` | General AI chat | `{ "message": "Your question" }` |
| `POST` | `/chat/docs-qa` | Document Q&A | `{ "message": "Question about docs" }` |
| `GET` | `/chat/documents` | Get available documents | None |

#### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |

#### Example API Calls

**General Chat:**
```bash
curl -X POST http://localhost:5000/api/chat/general \
  -H "Content-Type: application/json" \
  -d '{"message": "What is artificial intelligence?"}'
```

**Document Q&A:**
```bash
curl -X POST http://localhost:5000/api/chat/docs-qa \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the key features of React?"}'
```

## 💻 Technology Stack

### Frontend Technologies
- **React 18.2.0** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Axios** - HTTP client for API requests

### Backend Technologies
- **Express.js 4.18.2** - Web application framework
- **OpenAI API 4.20.1** - AI language model integration
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 16.3.1** - Environment variable management
- **Multer** - File upload handling (for future features)
- **Nodemon** - Development auto-reload

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🛠️ Development Scripts

### Backend Scripts
```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm test         # Run tests (placeholder)
```

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | - | ✅ Yes |
| `PORT` | Backend server port | 5000 | ❌ No |
| `NODE_ENV` | Environment mode | development | ❌ No |
| `OPENAI_ORG_ID` | OpenAI organization ID | - | ❌ No |

### Customization Options

**Frontend Customization:**
- Modify `tailwind.config.js` for theming
- Update components in `src/components/`
- Customize API endpoints in `src/lib/api.js`

**Backend Customization:**
- Add new routes in `routes/`
- Modify CORS settings in `server.js`
- Add middleware in `middleware/`

## 🐛 Troubleshooting

### Common Issues & Solutions

**❌ Backend not starting?**
```bash
# Check if OpenAI API key is set
echo $OPENAI_API_KEY

# Verify .env file exists and has correct format
cat backend/.env

# Check if port 5000 is already in use
lsof -i :5000
```

**❌ Frontend not connecting to backend?**
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check CORS settings in backend/server.js
# Ensure frontend URL is in allowed origins
```

**❌ No documents showing in Q&A mode?**
```bash
# Check if documents exist
ls backend/data/

# Verify file permissions
ls -la backend/data/

# Check server logs for document loading errors
```

**❌ OpenAI API errors?**
- Verify API key is valid and active
- Check your OpenAI account billing status
- Ensure you have sufficient API credits
- Verify API key has correct permissions

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
DEBUG=true
```

## 🚀 Deployment

### Production Build

**Backend:**
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Deployment Options
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Backend:** Heroku, Railway, DigitalOcean, AWS
- **Full-stack:** Render, Railway, Heroku

## 🔮 Roadmap & Future Enhancements

### Planned Features
- [ ] **File Upload Interface** - Upload documents via web UI
- [ ] **PDF Document Support** - Process PDF files
- [ ] **Vector Embeddings** - Enhanced document search with embeddings
- [ ] **User Authentication** - User accounts and session management
- [ ] **Chat History Persistence** - Save and restore chat sessions
- [ ] **Multiple AI Models** - Support for GPT-4, Claude, etc.
- [ ] **Document Collections** - Organize documents into collections
- [ ] **Advanced Search** - Full-text search within documents
- [ ] **Export Functionality** - Export chat conversations
- [ ] **Real-time Collaboration** - Multiple users in same chat

### Technical Improvements
- [ ] **Database Integration** - PostgreSQL/MongoDB support
- [ ] **Caching Layer** - Redis for improved performance
- [ ] **Rate Limiting** - API rate limiting and throttling
- [ ] **WebSocket Support** - Real-time bidirectional communication
- [ ] **Docker Support** - Containerization for easy deployment
- [ ] **CI/CD Pipeline** - Automated testing and deployment
- [ ] **Monitoring & Analytics** - Usage analytics and monitoring
- [ ] **API Documentation** - Interactive API docs with Swagger

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Getting Started
1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
4. **Make** your changes
5. **Test** your changes thoroughly
6. **Commit** your changes (`git commit -m 'Add amazing feature'`)
7. **Push** to the branch (`git push origin feature/amazing-feature`)
8. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting
- Update documentation if needed

### Reporting Issues
- Use GitHub Issues for bug reports
- Provide detailed reproduction steps
- Include environment information
- Add screenshots if applicable

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 AI Document Q&A Chatbot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

- **OpenAI** for providing the powerful GPT-3.5-turbo API
- **React Team** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the fast build tool and development experience
- **Express.js** for the robust web framework

## 📞 Support & Contact

- **GitHub Issues:** [Create an issue](https://github.com/your-username/ai-chatbot/issues)
- **Email:** your-email@example.com
- **Documentation:** [Project Wiki](https://github.com/your-username/ai-chatbot/wiki)

---

<p align="center">
  <strong>🚀 Made with ❤️ for AI-powered conversations and document intelligence</strong>
</p>

<p align="center">
  <sub>⭐ Star this repository if you found it helpful!</sub>
</p> 