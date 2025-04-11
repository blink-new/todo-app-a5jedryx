
import { useState, useEffect } from 'react'
import { TaskInput } from './components/TaskInput'
import { CurrentTask } from './components/CurrentTask'
import { Task, AppState } from './lib/types'
import { motion } from 'framer-motion'

const STORAGE_KEY = 'focus-app-state'

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : { currentTask: null, backlog: [] }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addTask = (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      created_at: new Date().toISOString()
    }

    setState(prev => ({
      currentTask: prev.currentTask || newTask,
      backlog: prev.currentTask ? [...prev.backlog, newTask] : prev.backlog
    }))
  }

  const completeCurrentTask = () => {
    setState(prev => ({
      currentTask: prev.backlog[0] || null,
      backlog: prev.backlog.slice(1)
    }))
  }

  const skipCurrentTask = () => {
    setState(prev => {
      if (!prev.currentTask) return prev
      return {
        currentTask: prev.backlog[0] || null,
        backlog: [...prev.backlog.slice(1), prev.currentTask]
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Focus</h1>
          <p className="text-white/70">One thing at a time.</p>
        </motion.div>

        {state.currentTask ? (
          <CurrentTask
            task={state.currentTask}
            onComplete={completeCurrentTask}
            onSkip={skipCurrentTask}
          />
        ) : (
          <motion.div 
            className="text-center text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            What's your most important task?
          </motion.div>
        )}

        <div className="w-full max-w-xl">
          <TaskInput 
            onAddTask={addTask}
            disabled={false}
          />
        </div>

        {state.backlog.length > 0 && (
          <motion.div 
            className="text-sm text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {state.backlog.length} task{state.backlog.length === 1 ? '' : 's'} in backlog
          </motion.div>
        )}
      </div>
    </div>
  )
}