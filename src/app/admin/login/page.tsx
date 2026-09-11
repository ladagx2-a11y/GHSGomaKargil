'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#080b0f]">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-[#8c6b32] rounded-full filter blur-[300px] opacity-[0.08]" />
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-[#a58145] rounded-full filter blur-[250px] opacity-[0.06]" />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-[#0b0f14]/80 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle top border gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8c6b32] to-transparent" />
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto relative mb-4 drop-shadow-[0_0_15px_rgba(140,107,50,0.4)]">
              <Image src="/logo.png" alt="GHS Logo" fill className="object-contain" />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: 'var(--font-lora)' }}>Admin Portal</h1>
            <p className="text-gray-400 text-sm">Secure access for institutional staff</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cfa861] transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111720] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#8c6b32]/50 focus:ring-1 focus:ring-[#8c6b32]/50 transition-all placeholder:text-gray-600"
                  placeholder="admin@edu.in"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cfa861] transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111720] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#8c6b32]/50 focus:ring-1 focus:ring-[#8c6b32]/50 transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-start gap-2"
              >
                <div className="mt-0.5">⚠️</div>
                <p>{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#8c6b32] to-[#a58145] hover:from-[#a58145] hover:to-[#8c6b32] text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(140,107,50,0.3)] disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Secure Login</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <a href="/" className="text-xs text-gray-500 hover:text-[#cfa861] transition-colors">
              &larr; Return to Public Portal
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
