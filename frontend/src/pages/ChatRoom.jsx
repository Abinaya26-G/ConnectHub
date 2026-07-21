import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ChatRoom = () => {
  const { roomCode } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [onlineCount, setOnlineCount] = useState(0)
  const wsRef = useRef(null)
  const connectedRef = useRef(false)
  const messagesEndRef = useRef(null)
  const hasJoined = useRef(false)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Connect WebSocket - ONLY ONCE
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return
    }

    const ws = new WebSocket('ws://13.239.242.222:9090/ws')

    ws.onopen = () => {
      connectedRef.current = true
      if (!hasJoined.current) {
        hasJoined.current = true
        const joinMsg = {
          type: 'JOIN',
          sender: user.name,
          content: user.name + ' joined the room',
          roomCode: roomCode,
          timestamp: Date.now()
        }
        ws.send(JSON.stringify(joinMsg))
      }
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) => m.timestamp === msg.timestamp && m.sender === msg.sender && m.content === msg.content
        )
        if (isDuplicate) return prev
        return [...prev, msg]
      })

      if (msg.type === 'COUNT') {
        setOnlineCount(parseInt(msg.content))
      }
    }

    ws.onclose = () => {
      connectedRef.current = false
      hasJoined.current = false
    }

    ws.onerror = () => {
      connectedRef.current = false
    }

    wsRef.current = ws

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
      connectedRef.current = false
      hasJoined.current = false
    }
  }, [])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return

    const msg = {
      type: 'CHAT',
      sender: user.name,
      content: inputMessage.trim(),
      roomCode: roomCode,
      timestamp: Date.now()
    }

    setMessages((prev) => [...prev, msg])
    wsRef.current.send(JSON.stringify(msg))
    setInputMessage('')
  }

  const handleLeave = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const leaveMsg = {
        type: 'LEAVE',
        sender: user.name,
        content: user.name + ' left the room',
        roomCode: roomCode,
        timestamp: Date.now()
      }
      wsRef.current.send(JSON.stringify(leaveMsg))
      wsRef.current.close()
    }
    connectedRef.current = false
    hasJoined.current = false
    navigate('/dashboard')
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-[#f0e8dd] px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-[#8b7355]">ConnectHub</h1>
          <span className="text-[#d4c5b0]">|</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#6b5a4a]">Room:</span>
            <span className="text-sm font-bold text-[#8b7355] tracking-widest">{roomCode}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#f5f0e8] rounded-full">
            <span className={`w-2 h-2 rounded-full ${connectedRef.current ? 'bg-[#90b890]' : 'bg-[#d0a0a0]'}`}></span>
            <span className="text-xs text-[#8a7a6a]">{onlineCount} online</span>
          </div>
          <button
            onClick={handleLeave}
            className="px-4 py-2 text-sm text-[#a09080] hover:text-[#c04040] transition"
          >
            Leave
          </button>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="text-center text-[#c0b0a0] mt-20">
            <div className="w-16 h-16 bg-[#f0e8dd] rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#c0b0a0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm mt-1">Say hello to start the conversation</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={`${msg.timestamp}-${msg.sender}-${index}`} className="mb-3">
            {/* JOIN notification */}
            {msg.type === 'JOIN' && (
              <div className="flex justify-center my-3">
                <span className="px-4 py-1.5 bg-[#e8f0e8] text-[#5a8a5a] rounded-full text-xs font-medium">
                  {msg.content}
                </span>
              </div>
            )}
            
            {/* LEAVE notification */}
            {msg.type === 'LEAVE' && (
              <div className="flex justify-center my-3">
                <span className="px-4 py-1.5 bg-[#f0e0e0] text-[#a06060] rounded-full text-xs font-medium">
                  {msg.content}
                </span>
              </div>
            )}
            
            {/* READY notification */}
            {msg.type === 'READY' && (
              <div className="flex justify-center my-3">
                <span className="px-4 py-1.5 bg-[#e8e0f0] text-[#6a5a8a] rounded-full text-xs font-medium border border-[#d0c8e0]">
                  {msg.content}
                </span>
              </div>
            )}
            
            {/* CHAT message - NO username shown */}
            {msg.type === 'CHAT' && (
              <div className={`flex ${msg.sender === user?.name ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-sm px-4 py-3 rounded-2xl ${
                  msg.sender === user?.name
                    ? 'bg-[#a89080] text-white rounded-br-md'
                    : 'bg-white text-[#5a4a3a] rounded-bl-md shadow-sm border border-[#f0e8dd]'
                }`}>
                  {/* Username REMOVED - only message and time */}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className={`text-xs mt-1.5 ${msg.sender === user?.name ? 'text-[#e8ddd0]' : 'text-[#c0b0a0]'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-[#f0e8dd] p-4">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={connectedRef.current ? "Type a message..." : "Connecting..."}
            disabled={!connectedRef.current}
            className="flex-1 px-5 py-3 bg-[#faf7f2] border border-[#e8ddd0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#d4c5b0] focus:border-transparent transition text-[#5a4a3a] placeholder-[#c0b0a0]"
          />
          <button
            type="submit"
            disabled={!connectedRef.current || !inputMessage.trim()}
            className="px-6 py-3 bg-[#a89080] text-white rounded-full hover:bg-[#988070] transition disabled:opacity-40 font-medium shadow-sm"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatRoom