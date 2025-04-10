
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'

interface Todo {
  id: string
  text: string
  completed: boolean
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    
    setTodos(prev => [
      {
        id: crypto.randomUUID(),
        text: newTodo.trim(),
        completed: false
      },
      ...prev
    ])
    setNewTodo('')
  }

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const remaining = todos.filter(todo => !todo.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Todo List</h1>
          
          <form onSubmit={addTodo} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="flex gap-2 mb-6">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-sm capitalize transition-all ${
                  filter === f
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredTodos.map(todo => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group animate-fade-in"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500 transition-all"
                />
                <span
                  className={`flex-1 ${
                    todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            {remaining} task{remaining === 1 ? '' : 's'} remaining
          </div>
        </div>
      </div>
    </div>
  )
}