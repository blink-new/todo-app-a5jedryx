
export interface Task {
  id: string
  text: string
  completed: boolean
  created_at: string
}

export interface AppState {
  currentTask: Task | null
  backlog: Task[]
}