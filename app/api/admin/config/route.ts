import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

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
          // Ignore
        }
      },
    },
  })
}

// GET - Load all config data from key-value pairs
export async function GET() {
  try {
    const supabase = await getSupabaseAdmin()

    // Fetch all config rows
    const { data, error } = await supabase.from("homepage_config").select("*")

    if (error) {
      console.error(" Error loading config:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convert array of {key, value} to flat object
    const config: Record<string, any> = {}
    if (data) {
      data.forEach((row: any) => {
        config[row.key] = row.value
      })
    }

    console.log(" Loaded config keys:", Object.keys(config))
    return NextResponse.json(config, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (e: any) {
    console.error(" GET /api/admin/config error:", e)
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 })
  }
}

// POST - Update specific config keys
export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseAdmin()
    const payload = await request.json()

    console.log(" POST /api/admin/config - received keys:", Object.keys(payload))

    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const upsertPromises = Object.entries(payload).map(async ([key, value]) => {
      console.log(` Upserting key: ${key}, value:`, JSON.stringify(value).substring(0, 200))

      const result = await supabase.from("homepage_config").upsert(
        {
          key,
          value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" },
      )

      if (result.error) {
        console.error(` ❌ ERROR upserting key ${key}:`, result.error)
        throw new Error(`Failed to save ${key}: ${result.error.message}`)
      } else {
        console.log(` ✅ Successfully upserted key: ${key}`)

        const { data: verifyData, error: verifyError } = await supabase
          .from("homepage_config")
          .select("*")
          .eq("key", key)
          .single()

        if (verifyError) {
          console.error(` ⚠️ Could not verify save for key ${key}:`, verifyError)
        } else {
          console.log(` ✓ Verified key ${key} in database:`, JSON.stringify(verifyData.value).substring(0, 100))
        }
      }

      return result
    })

    const results = await Promise.all(upsertPromises)

    // Check for errors
    const errors = results.filter((r) => r.error)
    if (errors.length > 0) {
      console.error(
        " Errors upserting data:",
        errors.map((e) => e.error),
      )
      return NextResponse.json({ error: errors[0].error?.message || "Failed to save data" }, { status: 500 })
    }

    console.log(" ✅ Successfully saved", Object.keys(payload).length, "config keys")

    revalidatePath("/")
    revalidatePath("/about")

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error(" POST /api/admin/config error:", e)
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 })
  }
}
