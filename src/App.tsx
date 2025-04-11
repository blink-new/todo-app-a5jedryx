
import { useState, useEffect } from 'react'
import { TaskInput } from './components/TaskInput'
import { CurrentTask } from './components/CurrentTask'
import { Auth } from './components/Auth'
import { Task } from './lib/types'
import { motion } from 'framer-motion'
import { supabase } from './lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [backlog, setBacklog] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return

    // Load tasks from Supabase
    const loadTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('position', { ascending: true })
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error loading tasks:', error)
        return
      }

      if (data && data.length > 0) {
        setCurrentTask(data[0])
        setBacklog(data.slice(1))
      }
    }

    loadTasks()
  }, [user])

  const addTask = async (text: string) => {
    if (!user) return

    const newTask = {
      user_id: user.id,
      text,
      position: backlog.length + (currentTask ? 1 : 0)
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single()

    if (error) {
      console.error('Error adding task:', error)
      return
    }

    if (!currentTask) {
      setCurrentTask(data)
    } else {
      setBacklog([...backlog, data])
    }
  }

  const completeCurrentTask = async () => {
    if (!currentTask || !user) return

    const { error } = await supabase
      .from('tasks')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('id', currentTask.id)

    if (error) {
      console.error('Error completing task:', error)
      return
    }

    setCurrentTask(backlog[0] || null)
    setBacklog(backlog.slice(1))
  }

  const skipCurrentTask = async () => {
    if (!currentTask || !user) return

    // Update positions
    const newBacklog = [...backlog.slice(1), currentTask]
    const updates = newBacklog.map((task, index) => ({
      id: task.id,
      position: index + 1
    }))

    const { error } = await supabase
      .from('tasks')
      .upsert(updates)

    if (error) {
      console.error('Error updating task positions:', error)
      return
    }

    setCurrentTask(backlog[0] || null)
    setBacklog(newBacklog)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center p-6">
        <Auth />
      </div>
    )
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

        {currentTask ? (
          <CurrentTask
            task={currentTask}
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

        {backlog.length > 0 && (
          <motion.div 
            className="text-sm text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {backlog.length} task{backlog.length === 1 ? '' : 's'} in backlog
          </motion.div>
        )}

        <motion.button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-white/50 hover:text-white/70 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign out
        </motion.button>
      </div>
    </div>
  )
}