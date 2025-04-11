
import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { analyzePriority, cleanTaskText } from '@/lib/prioritize'

interface TaskInputProps {
  onAddTask: (text: string, priority: number) => void
  disabled?: boolean
}

export function TaskInput({ onAddTask, disabled }: TaskInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    const priority = analyzePriority(input)
    const cleanText = cleanTaskText(input)
    
    onAddTask(cleanText, priority)
    setInput('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What's the most important thing you need to do? Add !!! for high priority, !! for medium, ! for low"
        className="min-h-[100px] resize-none"
        disabled={disabled}
      />
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          Tip: Start with !!! for must-do tasks
        </div>
        <Button type="submit" disabled={disabled || !input.trim()}>
          <Send className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>
    </form>
  )
}