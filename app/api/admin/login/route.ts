import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    const { username, password } = await request.json()
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const { data: user, error } = await supabaseAdmin.from("users").select("*").eq("username", username).single()

    if (error || !user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (user.password_hash !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // update last_login
    await supabaseAdmin.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    // create session
    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
    const { error: sessionErr } = await supabaseAdmin
      .from("user_sessions")
      .insert({ user_id: user.id, token, expires_at: expires.toISOString() })
    if (sessionErr) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    const cookieStore = await cookies()
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires,
    })

    return NextResponse.json({ user: { id: user.id, username: user.username, role: user.role } })
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
