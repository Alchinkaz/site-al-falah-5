import { createClient as createBrowserClient } from "./supabase/client"

const supabaseUrl = "https://rgqrysszglihhlrblcdo.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncXJ5c3N6Z2xpaGhscmJsY2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTYzMzgsImV4cCI6MjA3NjE5MjMzOH0.IBk4gFdrwWsRjJenh3cMnpmeFGarKB6HA-XLdqriAOw"

// Export the browser client for backward compatibility
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Database types (will be generated from Supabase later)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          password_hash: string
          role: "admin" | "editor"
          created_at: string
          last_login: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          role?: "admin" | "editor"
          created_at?: string
          last_login?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          role?: "admin" | "editor"
          created_at?: string
          last_login?: string | null
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string | null
          image: string | null
          content_image: string | null
          images: any[]
          badges: any[]
          investment_year: number | null
          content_sections: any[]
          published: boolean
          show_on_homepage: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title: string
          description?: string | null
          content?: string | null
          image?: string | null
          content_image?: string | null
          images?: any[]
          badges?: any[]
          investment_year?: number | null
          content_sections?: any[]
          published?: boolean
          show_on_homepage?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          content?: string | null
          image?: string | null
          content_image?: string | null
          images?: any[]
          badges?: any[]
          investment_year?: number | null
          content_sections?: any[]
          published?: boolean
          show_on_homepage?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      homepage_config: {
        Row: {
          id: string
          key: string
          value: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: any
          created_at?: string
          updated_at?: string
        }
      }
      translations: {
        Row: {
          id: string
          key: string
          language: "en" | "ru" | "kz"
          value: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          language: "en" | "ru" | "kz"
          value: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          language?: "en" | "ru" | "kz"
          value?: any
          created_at?: string
          updated_at?: string
        }
      }
      project_translations: {
        Row: {
          id: string
          project_id: string
          translation_type: "title" | "badges" | "sections"
          language: "en" | "ru" | "kz"
          value: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          translation_type: "title" | "badges" | "sections"
          language: "en" | "ru" | "kz"
          value: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          translation_type?: "title" | "badges" | "sections"
          language?: "en" | "ru" | "kz"
          value?: any
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          slug: string
          photo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          photo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          photo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      team_translations: {
        Row: {
          id: string
          team_member_slug: string
          translation_type: "name" | "role" | "bio_left" | "bio_right"
          language: "en" | "ru" | "kz"
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team_member_slug: string
          translation_type: "name" | "role" | "bio_left" | "bio_right"
          language: "en" | "ru" | "kz"
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          team_member_slug?: string
          translation_type?: "name" | "role" | "bio_left" | "bio_right"
          language?: "en" | "ru" | "kz"
          value?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          expires_at?: string
          created_at?: string
        }
      }
    }
  }
}
