import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err: any) {
      if (err.message === 'Firebase is not configured.') {
        setError('Firebase is not configured yet. Please check your .env file.')
      } else {
        setError('Google login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#08080F] px-4 py-12 relative overflow-hidden">
      {/* Radial glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#A855F7]/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#A855F7] flex items-center justify-center glow-violet transition-transform duration-500 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-white">
                <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm0 9h7v7h-7v-7zM4 13h3v3H4v-3zm4 0h3v3H8v-3zm0 4h3v3H8v-3zM4 17h3v3H4v-3z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">BracketDay</span>
          </a>
          <p className="text-[#8B8FA8] text-sm mt-4">Admin portal — sign in to manage your tournaments</p>
        </div>

        {/* Card */}
        <div className="bg-[#13131F]/50 backdrop-blur-xl border border-[#1F1F30] rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-8">Sign in</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#8B8FA8] font-bold uppercase tracking-wider ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="bg-[#0D0D1A] border border-[#2A2A40] rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-[#A855F7] transition-all duration-300 placeholder:text-[#8B8FA8]/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#8B8FA8] font-bold uppercase tracking-wider ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="bg-[#0D0D1A] border border-[#2A2A40] rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-[#A855F7] transition-all duration-300 placeholder:text-[#8B8FA8]/20"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl font-medium animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-[#A855F7] hover:bg-[#9333EA] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg shadow-[#A855F7]/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                'Sign in to Dashboard'
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[#1F1F30]" />
            <span className="text-[#8B8FA8] text-[10px] font-bold uppercase tracking-[0.2em]">or continue with</span>
            <div className="flex-1 h-px bg-[#1F1F30]" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-[#08080F] font-bold py-4 rounded-xl transition-all duration-300 active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>

        <p className="text-center text-[#8B8FA8] text-xs mt-8">
          By signing in, you agree to our{' '}
          <a href="#" className="text-white hover:underline">Terms of Service</a>
        </p>
      </div>
    </div>
  )
}
