import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    const { data, error } = await supabaseAdmin.from("translations").select("*")

    if (error) {
      console.error("Error fetching translations for debug:", error)
      return NextResponse.json({ error: "Failed to fetch translations" }, { status: 500 })
    }

    const result: Record<string, any> = {}
    ;(data || []).forEach((row: any) => {
      if (!result[row.key]) result[row.key] = {}
      result[row.key][row.language] = row.value
    })

    return NextResponse.json(result)
  } catch (e) {
    console.error("Internal server error in /api/debug/translations:", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
