import React from 'react'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Chat />
      </div>
    </div>
  )
}

export default App 