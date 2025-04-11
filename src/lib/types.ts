
import { Database as SupabaseDatabase } from './database.types'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Task {
  id: string
  text: string
  completed: boolean
  priority: number // 1-3, 1 being highest
  notes?: string
  created_at: string
  is_focused: boolean
}

export type Database = SupabaseDatabase

export const MAX_FOCUSED_TASKS = 3