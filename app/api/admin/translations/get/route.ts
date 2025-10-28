import { NextResponse } from "next/server"
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

export async function GET() {
  try {
    const supabaseAdmin = await getSupabaseAdmin()

    // Fetch all translations from Supabase
    const { data, error } = await supabaseAdmin.from("translations").select("*")

    if (error) {
      console.error(" Error fetching translations:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(" Loaded translations from Supabase:", data?.length, "rows")

    // Group by key
    const grouped: Record<string, Array<{ language: string; value: any }>> = {}

    data?.forEach((row) => {
      const { key, language, value } = row
      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push({ language, value })
    })

    // Reconstruct nested structure
    const translations: Record<string, any> = {}

    for (const [key, entries] of Object.entries(grouped)) {
      const parsedEntries = entries.map((entry) => {
        let parsedValue = entry.value
        if (typeof entry.value === "string") {
          // Try to parse JSON strings (arrays and objects)
          if (entry.value.startsWith("[") || entry.value.startsWith("{")) {
            try {
              parsedValue = JSON.parse(entry.value)
            } catch {
              parsedValue = entry.value
            }
          }
        }
        return { language: entry.language, value: parsedValue }
      })

      // Always create language objects for array values to preserve language-specific data
      if (key.includes(".")) {
        // Nested key like "portfolioI18n.heroTitle"
        const parts = key.split(".")
        let current = translations

        // Navigate/create nested structure
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {}
          }
          current = current[parts[i]]
        }

        // Set the final value as language object
        const finalKey = parts[parts.length - 1]
        current[finalKey] = {}
        parsedEntries.forEach((entry) => {
          current[finalKey][entry.language] = entry.value
        })
      } else {
        // Simple key like "heroTitle" or "aboutParagraphs"
        translations[key] = {}
        parsedEntries.forEach((entry) => {
          translations[key][entry.language] = entry.value
        })
        console.log(` Loaded language object for key ${key}:`, Object.keys(translations[key]))
      }
    }

    console.log(
      " Returning translations with portfolioI18n:",
      JSON.stringify(translations.portfolioI18n || {}).substring(0, 200),
    )
    return NextResponse.json({ translations }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (e: any) {
    console.error(" Translations GET API error:", e)
    return NextResponse.json({ error: e?.message || "Internal server error" }, { status: 500 })
  }
}
