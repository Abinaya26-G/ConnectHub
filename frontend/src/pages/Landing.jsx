import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      {/* Navbar */}
      <nav className="px-8 py-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#8b7355] tracking-tight">ConnectHub</h1>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 text-[#8b7355] hover:text-[#6b5a45] transition font-medium">
            Sign In
          </Link>
          <Link to="/register" className="px-5 py-2 bg-[#d4c5b0] text-white rounded-full hover:bg-[#c4b5a0] transition font-medium shadow-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-xl">
          <div className="w-20 h-20 bg-[#e8ddd0] rounded-3xl mx-auto mb-8 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-[#5a4a3a] mb-4 leading-tight">
            Private Conversations,<br />Made Simple
          </h2>
          <p className="text-[#8a7a6a] text-lg mb-10 leading-relaxed">
            Create a room, share your code, and chat in real-time. 
            No history, no traces — just pure connection.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="px-8 py-3 bg-[#a89080] text-white rounded-full hover:bg-[#988070] transition font-medium shadow-md">
              Create Account
            </Link>
            <Link to="/login" className="px-8 py-3 bg-white text-[#8b7355] border border-[#d4c5b0] rounded-full hover:bg-[#f5f0e8] transition font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-[#b0a090] text-sm">
        Temporary chat rooms for private conversations
      </div>
    </div>
  )
}

export default Landing