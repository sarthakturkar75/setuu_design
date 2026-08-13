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
      user_identity: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_actor: {
        Row: {
          id: string
          user_id: string | null
          first_name: string
          last_name: string
          roles: string[]
        }
        Insert: {
          id?: string
          user_id?: string | null
          first_name: string
          last_name: string
          roles?: string[]
        }
        Update: {
          id?: string
          user_id?: string | null
          first_name?: string
          last_name?: string
          roles?: string[]
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: string
          created_at?: string
        }
      }
      timesheets: {
        Row: {
          id: string
          project_id: string
          actor_id: string
          date: string
          hours_worked: number
          description: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          actor_id: string
          date: string
          hours_worked: number
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          actor_id?: string
          date?: string
          hours_worked?: number
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          vendor_id: string
          project_id: string
          invoice_number: string
          amount: number
          currency: string
          status: string
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          project_id: string
          invoice_number: string
          amount: number
          currency?: string
          status?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          project_id?: string
          invoice_number?: string
          amount?: number
          currency?: string
          status?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      wiki_docs: {
        Row: {
          id: string
          project_id: string
          title: string
          content: string | null
          author_id: string | null
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          content?: string | null
          author_id?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          content?: string | null
          author_id?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      break_glass_logs: {
        Row: {
          id: string
          actor_id: string | null
          reason: string
          duration_minutes: number
          status: string
          granted_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          actor_id?: string | null
          reason: string
          duration_minutes: number
          status?: string
          granted_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          actor_id?: string | null
          reason?: string
          duration_minutes?: number
          status?: string
          granted_at?: string
          expires_at?: string | null
        }
      }
      virus_scan_results: {
        Row: {
          id: string
          file_id: string
          status: string
          threat_details: string | null
          scanned_at: string
        }
        Insert: {
          id?: string
          file_id: string
          status?: string
          threat_details?: string | null
          scanned_at?: string
        }
        Update: {
          id?: string
          file_id?: string
          status?: string
          threat_details?: string | null
          scanned_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
