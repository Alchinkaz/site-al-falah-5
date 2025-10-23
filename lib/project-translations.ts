import { createClient } from "@supabase/supabase-js"

export interface ProjectTranslations {
  title: { en: string; ru: string; kz: string }
  badges: Array<{ en: string; ru: string; kz: string }>
  sections: {
    en: Array<{ title: string; text: string }>
    ru: Array<{ title: string; text: string }>
    kz: Array<{ title: string; text: string }>
  }
}

function getSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

export async function getProjectTranslations(projectId: string): Promise<ProjectTranslations | null> {
  try {
    const supabase = getSupabaseServer()

    // Fetch all translations for this project
    const { data, error } = await supabase.from("project_translations").select("*").eq("project_id", projectId)

    if (error) {
      console.error(` Error fetching translations for ${projectId}:`, error)
      return null
    }

    if (!data || data.length === 0) {
      return null
    }

    // Group by translation_type and language
    const result: ProjectTranslations = {
      title: { en: "", ru: "", kz: "" },
      badges: [],
      sections: { en: [], ru: [], kz: [] },
    }

    data.forEach((row) => {
      const { translation_type, language, value } = row

      if (translation_type === "title") {
        result.title[language as "en" | "ru" | "kz"] = typeof value === "string" ? value : (value as any)
      } else if (translation_type === "badges") {
        // Badges are stored as JSONB array - only need to set once
        if (result.badges.length === 0) {
          result.badges = value as any
        }
      } else if (translation_type === "sections") {
        result.sections[language as "en" | "ru" | "kz"] = value as any
      }
    })

    return result
  } catch (error) {
    console.error(` Error fetching translations for ${projectId}:`, error)
    return null
  }
}

export async function getAllProjectTranslations(projectIds: string[]): Promise<Record<string, ProjectTranslations>> {
  try {
    if (projectIds.length === 0) {
      return {}
    }

    // Check if we're on the server or client
    if (typeof window === "undefined") {
      // Server-side: fetch directly from Supabase
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("project_translations").select("*").in("project_id", projectIds)

      if (error) {
        console.error(" Error fetching project translations:", error)
        return {}
      }

      // Group by project_id
      const result: Record<string, ProjectTranslations> = {}

      projectIds.forEach((id) => {
        result[id] = {
          title: { en: "", ru: "", kz: "" },
          badges: [],
          sections: { en: [], ru: [], kz: [] },
        }
      })

      data?.forEach((row) => {
        const { project_id, translation_type, language, value } = row

        if (!result[project_id]) {
          result[project_id] = {
            title: { en: "", ru: "", kz: "" },
            badges: [],
            sections: { en: [], ru: [], kz: [] },
          }
        }

        if (translation_type === "title") {
          result[project_id].title[language as "en" | "ru" | "kz"] = typeof value === "string" ? value : (value as any)
        } else if (translation_type === "badges") {
          if (result[project_id].badges.length === 0) {
            result[project_id].badges = value as any
          }
        } else if (translation_type === "sections") {
          result[project_id].sections[language as "en" | "ru" | "kz"] = value as any
        }
      })

      return result
    } else {
      // Client-side: use API route
      console.log(" Fetching translations for projects:", projectIds)
      const response = await fetch(`/api/admin/translations/projects?ids=${projectIds.join(",")}`)

      if (!response.ok) {
        console.error(" Failed to fetch project translations:", response.status, response.statusText)
        return {}
      }

      const data = await response.json()
      console.log(" Received project translations:", data)
      return data.translations || {}
    }
  } catch (error) {
    console.error(" Error fetching all project translations:", error)
    return {}
  }
}
