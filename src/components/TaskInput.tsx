
import { useState } from 'react'
import { motion } from 'framer-motion'

interface TaskInputProps {
  onAddTask: (text: string) => void
  disabled?: boolean
}

export function TaskInput({ onAddTask, disabled }: TaskInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onAddTask(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <motion.input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What's the ONE thing you need to do right now?"
        className="w-full px-6 py-4 text-xl bg-white/50 backdrop-blur-sm border-2 border-white/20 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all placeholder:text-white/50 text-white"
        disabled={disabled}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      />
    </form>
  )
}