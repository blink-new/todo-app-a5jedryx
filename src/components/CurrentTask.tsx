
import { motion, AnimatePresence } from 'framer-motion'
import { Task } from '@/lib/types'
import { CheckCircle, XCircle } from 'lucide-react'

interface CurrentTaskProps {
  task: Task | null
  onComplete: () => void
  onSkip: () => void
}

export function CurrentTask({ task, onComplete, onSkip }: CurrentTaskProps) {
  if (!task) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={task.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl border-2 border-white/20"
      >
        <motion.h2 
          className="text-3xl font-bold text-white text-center mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {task.text}
        </motion.h2>

        <div className="flex justify-center gap-4">
          <motion.button
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CheckCircle className="w-5 h-5" />
            Done
          </motion.button>

          <motion.button
            onClick={onSkip}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white/80 font-medium transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <XCircle className="w-5 h-5" />
            Skip
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}