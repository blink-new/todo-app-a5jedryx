
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

export function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert('Error sending login link!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-3xl border-2 border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-white text-center mb-6">Welcome to Focus</h2>
      <p className="text-white/70 text-center mb-8">Sign in to sync your tasks across devices</p>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          required
        />
        
        <motion.button
          type="submit"
          className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          {loading ? 'Sending link...' : 'Send magic link'}
        </motion.button>
      </form>
    </motion.div>
  )
}