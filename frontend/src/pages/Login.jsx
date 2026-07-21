import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const emailRef = useRef(null)

  // Prevent browser autofill by using readOnly trick
  useEffect(() => {
    const timer = setTimeout(() => {
      if (emailRef.current) {
        emailRef.current.removeAttribute('readOnly')
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await api.post('/api/auth/login', { email, password })
      const { token, userId, name, email: userEmail } = response.data.data
      login(token, { id: userId, name, email: userEmail })
      navigate('/dashboard')
    } catch (err) {
      const errorMsg = err.response?.data?.message || ''
      if (errorMsg.toLowerCase().includes('invalid') || errorMsg.toLowerCase().includes('password')) {
        setError('Incorrect password. Please enter your correct email password.')
      } else {
        setError(errorMsg || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-[#8b7355]">ConnectHub</Link>
          <p className="text-[#a09080] mt-2 text-sm">Welcome back</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#f0e8dd] p-8">
          {error && (
            <div className="mb-4 p-3 bg-[#fff0f0] border border-[#ffd0d0] rounded-lg text-[#c04040] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#6b5a4a] mb-2">Email Address</label>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="off"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readOnly')}
                className="w-full px-4 py-3 bg-[#faf7f2] border border-[#e8ddd0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4c5b0] focus:border-transparent transition text-[#5a4a3a]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6b5a4a] mb-2">Email Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your email password"
                autoComplete="new-password"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readOnly')}
                className="w-full px-4 py-3 bg-[#faf7f2] border border-[#e8ddd0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4c5b0] focus:border-transparent transition text-[#5a4a3a]"
                required
              />
              <p className="text-xs text-[#b0a090] mt-1">Enter your registered email password</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#a89080] text-white rounded-xl hover:bg-[#988070] transition font-medium disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-[#a09080]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#8b7355] hover:text-[#6b5a45] font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login