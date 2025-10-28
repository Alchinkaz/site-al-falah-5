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

export async function POST(request: Request) {
  try {
    const supabaseAdmin = await getSupabaseAdmin()
    const body = await request.json().catch(() => ({}))

    console.log(" POST /api/admin/translations - Received body keys:", Object.keys(body))

    // Legacy single-item payload support: { key, language, value }
    if (body?.key && body?.language && "value" in body) {
      await upsertTranslation(supabaseAdmin, body.key, body.language, body.value)
      return NextResponse.json({ ok: true })
    }

    // Batch payload: { updates: { key: value } }
    const updates = body?.updates
    if (!updates || typeof updates !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const langs: Array<"en" | "ru" | "kz"> = ["en", "ru", "kz"]

    for (const [key, val] of Object.entries(updates as Record<string, any>)) {
      console.log(` Processing key: ${key}`)
      await processValue(supabaseAdmin, key, val, langs)
    }

    console.log(" All translations saved successfully")
    return NextResponse.json({ ok: true }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (e: any) {
    console.error(" Translations API error:", e)
    return NextResponse.json({ error: e?.message || "Internal server error" }, { status: 500 })
  }
}

async function processValue(supabaseAdmin: any, key: string, val: any, langs: Array<"en" | "ru" | "kz">) {
  if (val === null || val === undefined) {
    for (const lang of langs) {
      await upsertTranslation(supabaseAdmin, key, lang, null)
    }
    return
  }

  if (Array.isArray(val)) {
    const jsonString = JSON.stringify(val)
    console.log(` Saving array for key ${key}:`, jsonString.substring(0, 100))
    for (const lang of langs) {
      await upsertTranslation(supabaseAdmin, key, lang, jsonString)
    }
    return
  }

  if (typeof val === "object") {
    // Check if it's a language object {en: ..., ru: ..., kz: ...}
    const hasLangKeys = langs.some((lang) => Object.prototype.hasOwnProperty.call(val, lang))

    if (hasLangKeys) {
      console.log(` Saving language object for key ${key}`)
      // Direct language object - save each language
      for (const lang of langs) {
        if (Object.prototype.hasOwnProperty.call(val, lang)) {
          const langValue = (val as any)[lang]
          // If the language value is an array, serialize it
          const finalValue = Array.isArray(langValue) ? JSON.stringify(langValue) : langValue
          await upsertTranslation(supabaseAdmin, key, lang, finalValue)
        }
      }
    } else {
      console.log(` Saving nested object for key ${key}`)
      // Nested object - recurse with composite keys
      for (const [childKey, childVal] of Object.entries(val)) {
        const compositeKey = `${key}.${childKey}`
        await processValue(supabaseAdmin, compositeKey, childVal, langs)
      }
    }
    return
  }

  for (const lang of langs) {
    await upsertTranslation(supabaseAdmin, key, lang, val)
  }
}

async function upsertTranslation(supabaseAdmin: any, key: string, lang: "en" | "ru" | "kz", value: any) {
  const cleaned = value === undefined ? null : value
  const { error } = await supabaseAdmin
    .from("translations")
    .upsert(
      { key, language: lang, value: cleaned, updated_at: new Date().toISOString() },
      { onConflict: "key,language" },
    )
  if (error) {
    console.error(` Error upserting translation for ${key}.${lang}:`, error)
    throw error
  }
}
