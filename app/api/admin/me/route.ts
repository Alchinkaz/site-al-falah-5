import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ user: null })
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    const cookieStore = await cookies()
    const token = cookieStore.get("admin_session")?.value
    if (!token) return NextResponse.json({ user: null })

    const { data: session } = await supabaseAdmin
      .from("user_sessions")
      .select("*, users(*)")
      .eq("token", token)
      .gte("expires_at", new Date().toISOString())
      .single()

    if (!session || !session.users) return NextResponse.json({ user: null })

    return NextResponse.json({
      user: { id: session.users.id, username: session.users.username, role: session.users.role },
    })
  } catch (e) {
    return NextResponse.json({ user: null })
  }
}
