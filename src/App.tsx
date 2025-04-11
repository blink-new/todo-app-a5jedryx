
import { useState, useEffect } from 'react'
import { TaskInput } from './components/TaskInput'
import { TaskList } from './components/TaskList'
import { Task, MAX_FOCUSED_TASKS } from './lib/types'
import { Button } from './components/ui/button'
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs'
import { Brain, ListTodo } from 'lucide-react'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : []
  })
  
  const [focusMode, setFocusMode] = useState(false)

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (text: string, priority: number) => {
    setTasks(prev => [
      {
        id: crypto.randomUUID(),
        text,
        completed: false,
        priority,
        created_at: new Date().toISOString(),
        is_focused: false
      },
      ...prev
    ])
  }

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const toggleFocus = (id: string) => {
    setTasks(prev => {
      const focusedCount = prev.filter(t => t.is_focused && t.id !== id).length
      const task = prev.find(t => t.id === id)
      
      if (!task) return prev
      
      // If task is already focused, we can always unfocus it
      if (task.is_focused) {
        return prev.map(t => 
          t.id === id ? { ...t, is_focused: false } : t
        )
      }
      
      // Otherwise, only allow focusing if we haven't hit the limit
      if (focusedCount < MAX_FOCUSED_TASKS) {
        return prev.map(t => 
          t.id === id ? { ...t, is_focused: true } : t
        )
      }
      
      return prev
    })
  }

  const focusedTasks = tasks.filter(t => t.is_focused)
  const remainingFocusSlots = MAX_FOCUSED_TASKS - focusedTasks.length
  
  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by priority first (1 is highest)
    if (a.priority !== b.priority) return a.priority - b.priority
    // Then by completion status
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    // Finally by creation date
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Focus Mode
              </h1>
              <Tabs 
                defaultValue="all" 
                value={focusMode ? "focus" : "all"}
                onValueChange={(v) => setFocusMode(v === "focus")}
              >
                <TabsList>
                  <TabsTrigger value="all">
                    <ListTodo className="w-4 h-4 mr-2" />
                    All Tasks
                  </TabsTrigger>
                  <TabsTrigger value="focus">
                    <Brain className="w-4 h-4 mr-2" />
                    Focus ({focusedTasks.length}/{MAX_FOCUSED_TASKS})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {focusMode ? (
              <>
                {focusedTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <Brain className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No focused tasks yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Select up to 3 important tasks to focus on
                    </p>
                    <Button
                      onClick={() => setFocusMode(false)}
                      variant="outline"
                    >
                      Add Tasks
                    </Button>
                  </div>
                ) : (
                  <TaskList
                    tasks={focusedTasks}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                    onToggleFocus={toggleFocus}
                    focusMode
                  />
                )}
              </>
            ) : (
              <>
                <TaskInput 
                  onAddTask={addTask}
                  disabled={false}
                />
                
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      All Tasks
                    </h2>
                    {remainingFocusSlots > 0 && (
                      <span className="text-sm text-gray-500">
                        Select {remainingFocusSlots} more task{remainingFocusSlots !== 1 ? 's' : ''} to focus on
                      </span>
                    )}
                  </div>
                  
                  <TaskList
                    tasks={sortedTasks}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                    onToggleFocus={toggleFocus}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}