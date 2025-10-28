import { supabase } from "./supabase"
import type { Database } from "./supabase"
import { generateSlug } from "./utils"

// Types
type User = Database["public"]["Tables"]["users"]["Row"]
type Project = Database["public"]["Tables"]["projects"]["Row"]
type HomepageConfig = Database["public"]["Tables"]["homepage_config"]["Row"]
type Translation = Database["public"]["Tables"]["translations"]["Row"]
type ProjectTranslation = Database["public"]["Tables"]["project_translations"]["Row"]
type TeamMember = Database["public"]["Tables"]["team_members"]["Row"]
type TeamTranslation = Database["public"]["Tables"]["team_translations"]["Row"]

// User Management
export class UserService {
  static async authenticate(username: string, password: string): Promise<User | null> {
    try {
      // First, check if we have any users, if not, create default admin
      const { data: users, error: usersError } = await supabase.from("users").select("*").limit(1)

      if (usersError || !users || users.length === 0) {
        // Create default admin user
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({
            id: "1",
            username: "admin",
            password_hash: "admin123",
            role: "admin",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (createError) {
          console.error("Error creating default user:", createError)
          return null
        }

        // If we just created the user and it matches the login attempt
        if (newUser.username === username && newUser.password_hash === password) {
          return newUser
        }
      }

      // Try to authenticate
      const { data, error } = await supabase.from("users").select("*").eq("username", username).single()

      if (error || !data) return null

      // Simple password check (in production, use proper hashing)
      if (data.password_hash !== password) return null

      // Update last login
      await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", data.id)

      return data
    } catch (error) {
      console.error("Authentication error:", error)
      return null
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

      if (error) {
        console.error("Get user error:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Get user error:", error)
      return null
    }
  }

  static async updateUser(id: string, updates: any): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Update user error:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Update user error:", error)
      return null
    }
  }

  static async updateUserByUsername(username: string, updates: any): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("username", username)
        .select()
        .single()

      if (error) {
        console.error("Update user by username error:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Update user by username error:", error)
      return null
    }
  }
}

// Project Management
export class ProjectService {
  static async getAllProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

      return error ? [] : data || []
    } catch (error) {
      console.error("Get projects error:", error)
      return []
    }
  }

  static async getProjectById(id: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

      return error ? null : data
    } catch (error) {
      console.error("Get project error:", error)
      return null
    }
  }

  static async getPublishedProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })

      return error ? [] : data || []
    } catch (error) {
      console.error("Get published projects error:", error)
      return []
    }
  }

  static async getHomepageProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .eq("show_on_homepage", true)
        .order("created_at", { ascending: false })

      return error ? [] : data || []
    } catch (error) {
      console.error("Get homepage projects error:", error)
      return []
    }
  }

  static async createProject(project: Database["public"]["Tables"]["projects"]["Insert"]): Promise<Project | null> {
    try {
      const slug = project.slug || generateSlug(project.title || "untitled-project")

      console.log(" Creating project with slug:", slug)

      const { data, error } = await supabase
        .from("projects")
        .insert({
          ...project,
          slug,
        })
        .select()
        .single()

      if (error) {
        console.error(" Error creating project:", error)
        return null
      }

      console.log(" Project created successfully:", data)
      return data
    } catch (error) {
      console.error(" Create project error:", error)
      return null
    }
  }

  static async updateProject(
    id: string,
    updates: Database["public"]["Tables"]["projects"]["Update"],
  ): Promise<Project | null> {
    try {
      const finalUpdates = { ...updates, updated_at: new Date().toISOString() }

      if (updates.title && typeof updates.title === "string") {
        finalUpdates.slug = generateSlug(updates.title)
        console.log(" Updating project slug to:", finalUpdates.slug)
      }

      const { data, error } = await supabase.from("projects").update(finalUpdates).eq("id", id).select().single()

      if (error) {
        console.error(" Error updating project:", error)
        return null
      }

      console.log(" Project updated successfully:", data)
      return data
    } catch (error) {
      console.error(" Update project error:", error)
      return null
    }
  }

  static async deleteProject(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id)

      return !error
    } catch (error) {
      console.error("Delete project error:", error)
      return false
    }
  }

  static async getProjectBySlug(slug: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).single()

      return error ? null : data
    } catch (error) {
      console.error("Get project by slug error:", error)
      return null
    }
  }
}

// Translation Management
export class TranslationService {
  static async getTranslations(): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase.from("translations").select("*")

      if (error || !data) return {}

      const translations: Record<string, any> = {}
      data.forEach((translation) => {
        if (!translations[translation.key]) {
          translations[translation.key] = {}
        }
        let value: any = translation.value
        if (typeof value === "string") {
          const startsLikeJson = value.startsWith("[") || value.startsWith("{")
          if (startsLikeJson) {
            try {
              value = JSON.parse(value)
            } catch {
              // keep original string if JSON.parse fails
            }
          }
        }
        translations[translation.key][translation.language] = value
      })

      return translations
    } catch (error) {
      console.error("Get translations error:", error)
      return {}
    }
  }

  static async updateTranslation(key: string, language: "en" | "ru" | "kz", value: any): Promise<boolean> {
    try {
      const { error } = await supabase.from("translations").upsert({
        key,
        language,
        value,
        updated_at: new Date().toISOString(),
      })

      return !error
    } catch (error) {
      console.error("Update translation error:", error)
      return false
    }
  }

  static async getProjectTranslations(projectId: string): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase.from("project_translations").select("*").eq("project_id", projectId)

      if (error || !data) return {}

      const translations: Record<string, any> = {}
      data.forEach((translation) => {
        if (!translations[translation.translation_type]) {
          translations[translation.translation_type] = {}
        }
        translations[translation.translation_type][translation.language] = translation.value
      })

      return translations
    } catch (error) {
      console.error("Get project translations error:", error)
      return {}
    }
  }

  static async updateProjectTranslation(
    projectId: string,
    type: "title" | "badges" | "sections",
    language: "en" | "ru" | "kz",
    value: any,
  ): Promise<boolean> {
    try {
      const { data: existing, error: checkError } = await supabase
        .from("team_translations")
        .select("*")
        .eq("team_member_slug", projectId)
        .eq("translation_type", type)
        .eq("language", language)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking existing translation:", checkError)
        return false
      }

      if (existing) {
        // Record exists, do UPDATE
        const { error: updateError } = await supabase
          .from("team_translations")
          .update({
            value,
            updated_at: new Date().toISOString(),
          })
          .eq("team_member_slug", projectId)
          .eq("translation_type", type)
          .eq("language", language)

        if (updateError) {
          console.error("Error updating team translation:", updateError)
          return false
        }
      } else {
        // Record doesn't exist, do INSERT
        const { error: insertError } = await supabase.from("team_translations").insert({
          team_member_slug: projectId,
          translation_type: type,
          language,
          value,
          updated_at: new Date().toISOString(),
        })

        if (insertError) {
          console.error("Error inserting team translation:", insertError)
          return false
        }
      }

      return true
    } catch (error) {
      console.error("Update team translation error:", error)
      return false
    }
  }
}

// Homepage Configuration
export class HomepageService {
  static async getHomepageData(): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase.from("homepage_config").select("*")

      if (error || !data) return {}

      const config: Record<string, any> = {}
      data.forEach((item) => {
        config[item.key] = item.value
      })

      return config
    } catch (error) {
      console.error("Get homepage data error:", error)
      return {}
    }
  }

  static async updateHomepageData(key: string, value: any): Promise<boolean> {
    try {
      const { error } = await supabase.from("homepage_config").upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
      })

      return !error
    } catch (error) {
      console.error("Update homepage data error:", error)
      return false
    }
  }
}

// Team Management
export class TeamService {
  static async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase.from("team_members").select("*").order("created_at", { ascending: true })

      return error ? [] : data || []
    } catch (error) {
      console.error("Get team members error:", error)
      return []
    }
  }

  static async updateTeamMemberPhoto(slug: string, photo: string): Promise<boolean> {
    try {
      console.log(` Updating photo for ${slug}:`, photo)

      // Check if the team member exists
      const { data: existing, error: checkError } = await supabase
        .from("team_members")
        .select("*")
        .eq("slug", slug)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking existing team member:", checkError)
        return false
      }

      if (existing) {
        // Record exists, do UPDATE
        const { error: updateError } = await supabase
          .from("team_members")
          .update({
            photo,
            updated_at: new Date().toISOString(),
          })
          .eq("slug", slug)

        if (updateError) {
          console.error("Error updating team member photo:", updateError)
          return false
        }
      } else {
        // Record doesn't exist, do INSERT
        const { error: insertError } = await supabase.from("team_members").insert({
          slug,
          photo,
          updated_at: new Date().toISOString(),
        })

        if (insertError) {
          console.error("Error inserting team member:", insertError)
          return false
        }
      }

      console.log(` Successfully updated photo for ${slug}`)
      return true
    } catch (error) {
      console.error("Update team member photo error:", error)
      return false
    }
  }

  static async getTeamTranslations(slug: string): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase.from("team_translations").select("*").eq("team_member_slug", slug)

      if (error || !data) return {}

      const translations: Record<string, any> = {}
      data.forEach((translation) => {
        if (!translations[translation.translation_type]) {
          translations[translation.translation_type] = {}
        }
        translations[translation.translation_type][translation.language] = translation.value
      })

      return translations
    } catch (error) {
      console.error("Get team translations error:", error)
      return {}
    }
  }

  static async updateTeamTranslation(
    slug: string,
    type: "name" | "role" | "bio_left" | "bio_right",
    language: "en" | "ru" | "kz",
    value: string,
  ): Promise<boolean> {
    try {
      const { data: existing, error: checkError } = await supabase
        .from("team_translations")
        .select("*")
        .eq("team_member_slug", slug)
        .eq("translation_type", type)
        .eq("language", language)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking existing translation:", checkError)
        return false
      }

      if (existing) {
        // Record exists, do UPDATE
        const { error: updateError } = await supabase
          .from("team_translations")
          .update({
            value,
            updated_at: new Date().toISOString(),
          })
          .eq("team_member_slug", slug)
          .eq("translation_type", type)
          .eq("language", language)

        if (updateError) {
          console.error("Error updating team translation:", updateError)
          return false
        }
      } else {
        // Record doesn't exist, do INSERT
        const { error: insertError } = await supabase.from("team_translations").insert({
          team_member_slug: slug,
          translation_type: type,
          language,
          value,
          updated_at: new Date().toISOString(),
        })

        if (insertError) {
          console.error("Error inserting team translation:", insertError)
          return false
        }
      }

      return true
    } catch (error) {
      console.error("Update team translation error:", error)
      return false
    }
  }
}
