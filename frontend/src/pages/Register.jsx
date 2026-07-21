import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (emailPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await api.post('/api/auth/register', { 
        name, 
        email, 
        password: emailPassword 
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-[#8b7355]">ConnectHub</Link>
          <p className="text-[#a09080] mt-2 text-sm">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#f0e8dd] p-8">
          {error && (
            <div className="mb-4 p-3 bg-[#fff0f0] border border-[#ffd0d0] rounded-lg text-[#c04040] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#6b5a4a] mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                autoComplete="off"
                className="w-full px-4 py-3 bg-[#faf7f2] border border-[#e8ddd0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4c5b0] focus:border-transparent transition text-[#5a4a3a]"
                required
                minLength={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6b5a4a] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="off"
                className="w-full px-4 py-3 bg-[#faf7f2] border border-[#e8ddd0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4c5b0] focus:border-transparent transition text-[#5a4a3a]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6b5a4a] mb-2">Email Password</label>
              <input
                type="password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                placeholder="Your email password"
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-[#faf7f2] border border-[#e8ddd0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4c5b0] focus:border-transparent transition text-[#5a4a3a]"
                required
                minLength={6}
              />
              <p className="text-xs text-[#b0a090] mt-1">Enter your actual email password</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#a89080] text-white rounded-xl hover:bg-[#988070] transition font-medium disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-[#a09080]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#8b7355] hover:text-[#6b5a45] font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register