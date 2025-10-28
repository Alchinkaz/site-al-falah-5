import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectIds = searchParams.get("ids")?.split(",") || []

    if (projectIds.length === 0) {
      return NextResponse.json({ translations: {} })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(" Missing Supabase environment variables")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Fetch all translations for all projects in one query
    const { data, error } = await supabase.from("project_translations").select("*").in("project_id", projectIds)

    if (error) {
      console.error(" Error fetching project translations:", error)
      return NextResponse.json({ error: "Failed to fetch translations" }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ translations: {} })
    }

    // Group by project_id
    const translations: Record<
      string,
      {
        title: { en: string; ru: string; kz: string }
        badges: Array<{ en: string; ru: string; kz: string }>
        sections: {
          en: Array<{ title: string; text: string }>
          ru: Array<{ title: string; text: string }>
          kz: Array<{ title: string; text: string }>
        }
      }
    > = {}

    projectIds.forEach((id) => {
      translations[id] = {
        title: { en: "", ru: "", kz: "" },
        badges: [],
        sections: { en: [], ru: [], kz: [] },
      }
    })

    data.forEach((row) => {
      const { project_id, translation_type, language, value } = row

      if (!translations[project_id]) {
        translations[project_id] = {
          title: { en: "", ru: "", kz: "" },
          badges: [],
          sections: { en: [], ru: [], kz: [] },
        }
      }

      if (translation_type === "title") {
        translations[project_id].title[language as "en" | "ru" | "kz"] =
          typeof value === "string" ? value : (value as any)
      } else if (translation_type === "badges") {
        // Badges are stored as JSONB array - only need to set once
        if (translations[project_id].badges.length === 0) {
          translations[project_id].badges = value as any
        }
      } else if (translation_type === "sections") {
        translations[project_id].sections[language as "en" | "ru" | "kz"] = value as any
      }
    })

    console.log(" Successfully fetched translations for", projectIds.length, "projects")
    return NextResponse.json({ translations })
  } catch (error) {
    console.error(" Error in projects translations API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
