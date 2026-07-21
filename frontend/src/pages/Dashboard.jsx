import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [roomCode, setRoomCode] = useState('')
  const [createdRoomCode, setCreatedRoomCode] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const handleCreateRoom = async () => {
    setError('')
    setCreatedRoomCode(null)
    setLoading(true)
    try {
      const response = await api.post('/api/rooms/create')
      const room = response.data.data
      setCreatedRoomCode(room.roomCode)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRoom = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/api/rooms/join', { roomCode: roomCode.toUpperCase() })
      navigate(`/room/${roomCode.toUpperCase()}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join room')
    } finally {
      setLoading(false)
    }
  }

  const copyCode = async () => {
  if (!createdRoomCode) return

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(createdRoomCode)
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = createdRoomCode
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      document.execCommand("copy")
      document.body.removeChild(textArea)
    }

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)

  } catch (error) {
    console.error("Failed to copy room code:", error)
  }
}
  const enterRoom = () => {
    navigate(`/room/${createdRoomCode}`)
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <nav className="bg-white border-b border-[#f0e8dd] px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#8b7355]">ConnectHub</h1>
        <div className="flex items-center gap-4">
          <span className="text-[#8a7a6a] text-sm">Hi, {user?.name}</span>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-[#a09080] hover:text-[#8b7355] transition"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto mt-16 px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#5a4a3a] mb-2">Your Space</h2>
          <p className="text-[#a09080]">Create a room or join one</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#f0e8dd] p-8 mb-6">
          <h3 className="text-lg font-semibold text-[#5a4a3a] mb-4">Create a Room</h3>
          <p className="text-[#a09080] text-sm mb-6">
            Generate a unique 6-digit code and share it with someone to start chatting.
          </p>

          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="w-full py-3 bg-[#a89080] text-white rounded-xl hover:bg-[#988070] transition font-medium disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Creating...' : 'Generate Room Code'}
          </button>

          {createdRoomCode && (
            <div className="mt-6 p-4 bg-[#f5f0e8] rounded-xl border border-[#e8ddd0]">
              <p className="text-sm text-[#8a7a6a] mb-2">Your room code:</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#5a4a3a] tracking-widest">{createdRoomCode}</span>
                <button
  onClick={copyCode}
  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
    copied
      ? "bg-green-500 text-white"
      : "bg-white border border-[#d4c5b0] text-[#8b7355] hover:bg-[#faf7f2]"
  }`}
>
  {copied ? "Copied ✓" : "Copy"}
</button>
              </div>
              <button
                onClick={enterRoom}
                className="mt-4 w-full py-2 bg-[#8b7355] text-white rounded-lg hover:bg-[#7a6545] transition text-sm font-medium"
              >
                Enter Room
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[#e8ddd0]"></div>
          <span className="text-[#b0a090] text-sm">or</span>
          <div className="flex-1 h-px bg-[#e8ddd0]"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#f0e8dd] p-8">
          <h3 className="text-lg font-semibold text-[#5a4a3a] mb-4">Join a Room</h3>
          <p className="text-[#a09080] text-sm mb-6">
            Enter the 6-digit code shared with you.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#fff0f0] border border-[#ffd0d0] rounded-lg text-[#c04040] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleJoinRoom} className="flex gap-3">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter code (e.g. ABC123)"
              maxLength={6}
              className="flex-1 px-4 py-3 bg-[#faf7f2] border border-[#e8ddd0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4c5b0] focus:border-transparent transition text-[#5a4a3a] uppercase tracking-widest text-center font-medium"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#d4c5b0] text-white rounded-xl hover:bg-[#c4b5a0] transition font-medium disabled:opacity-50"
            >
              {loading ? '...' : 'Join'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Dashboard