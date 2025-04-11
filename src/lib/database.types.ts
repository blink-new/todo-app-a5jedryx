
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          user_id: string
          text: string
          completed: boolean
          created_at: string
          completed_at: string | null
          position: number
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          completed?: boolean
          created_at?: string
          completed_at?: string | null
          position?: number
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          completed?: boolean
          created_at?: string
          completed_at?: string | null
          position?: number
        }
      }
    }
  }
}