
import { Task } from '@/lib/types'
import { CheckCircle, Circle, Star, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskListProps {
  tasks: Task[]
  onToggleTask: (id: string) => void
  onDeleteTask: (id: string) => void
  onToggleFocus: (id: string) => void
  focusMode?: boolean
}

export function TaskList({ 
  tasks, 
  onToggleTask, 
  onDeleteTask,
  onToggleFocus,
  focusMode 
}: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div
          key={task.id}
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg group transition-all",
            task.completed ? "bg-gray-50" : "bg-white",
            task.is_focused && "border-2 border-purple-500"
          )}
        >
          <button
            onClick={() => onToggleTask(task.id)}
            className="mt-1 text-gray-400 hover:text-purple-500 transition-colors"
          >
            {task.completed ? (
              <CheckCircle className="w-5 h-5 text-purple-500" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className={cn(
              "text-gray-900 break-words",
              task.completed && "line-through text-gray-400"
            )}>
              {task.text}
            </div>
            {task.notes && (
              <div className="mt-1 text-sm text-gray-500 break-words">
                {task.notes}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!focusMode && (
              <button
                onClick={() => onToggleFocus(task.id)}
                className={cn(
                  "p-1 rounded hover:bg-gray-100 transition-colors",
                  task.is_focused && "text-purple-500"
                )}
              >
                <Star className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDeleteTask(task.id)}
              className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute top-2 right-2">
            {task.priority === 1 && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                Must Do
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}