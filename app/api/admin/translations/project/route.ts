import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

async function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables")
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Ignore errors in server components
        }
      },
    },
  })
}

// GET: Load project translations from project_translations table
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("id") || searchParams.get("projectId")

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const supabaseAdmin = await getSupabaseAdmin()

    // Fetch all translations for this project
    const { data, error } = await supabaseAdmin.from("project_translations").select("*").eq("project_id", projectId)

    if (error) {
      console.error(" Error fetching project translations:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(" Loaded project translations for", projectId, ":", data?.length, "rows")

    // Group by translation_type and language
    const result: {
      title?: { en: string; ru: string; kz: string }
      badges?: Array<{ en: string; ru: string; kz: string }>
      sections?: {
        en: Array<{ title: string; text: string }>
        ru: Array<{ title: string; text: string }>
        kz: Array<{ title: string; text: string }>
      }
    } = {}

    data?.forEach((row) => {
      const { translation_type, language, value } = row

      if (translation_type === "title") {
        if (!result.title) {
          result.title = { en: "", ru: "", kz: "" }
        }
        // Value is stored as JSONB, extract the string
        result.title[language as "en" | "ru" | "kz"] = typeof value === "string" ? value : (value as any)
      } else if (translation_type === "badges") {
        // Badges are stored as JSONB array
        result.badges = value as any
      } else if (translation_type === "sections") {
        if (!result.sections) {
          result.sections = { en: [], ru: [], kz: [] }
        }
        // Sections are stored as JSONB array
        result.sections[language as "en" | "ru" | "kz"] = value as any
      }
    })

    return NextResponse.json(result)
  } catch (e: any) {
    console.error(" Project translations GET error:", e)
    return NextResponse.json({ error: e?.message || "Internal server error" }, { status: 500 })
  }
}

// POST: Save project translations to project_translations table
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, title, badges, sections } = body

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const supabaseAdmin = await getSupabaseAdmin()

    console.log(" Saving project translations for", projectId)

    // Save title translations (one row per language)
    if (title) {
      for (const lang of ["en", "ru", "kz"] as const) {
        const { error } = await supabaseAdmin.from("project_translations").upsert(
          {
            project_id: projectId,
            translation_type: "title",
            language: lang,
            value: title[lang],
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "project_id,translation_type,language",
          },
        )

        if (error) {
          console.error(` Error saving title translation (${lang}):`, error)
        }
      }
    }

    // Save badge translations (stored as JSONB array, same for all languages)
    if (badges) {
      for (const lang of ["en", "ru", "kz"] as const) {
        const { error } = await supabaseAdmin.from("project_translations").upsert(
          {
            project_id: projectId,
            translation_type: "badges",
            language: lang,
            value: badges,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "project_id,translation_type,language",
          },
        )

        if (error) {
          console.error(` Error saving badges translation (${lang}):`, error)
        }
      }
    }

    // Save section translations (one row per language)
    if (sections) {
      for (const lang of ["en", "ru", "kz"] as const) {
        const { error } = await supabaseAdmin.from("project_translations").upsert(
          {
            project_id: projectId,
            translation_type: "sections",
            language: lang,
            value: sections[lang],
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "project_id,translation_type,language",
          },
        )

        if (error) {
          console.error(` Error saving sections translation (${lang}):`, error)
        }
      }
    }

    console.log(" Successfully saved project translations")

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error(" Project translations POST error:", e)
    return NextResponse.json({ error: e?.message || "Internal server error" }, { status: 500 })
  }
}
