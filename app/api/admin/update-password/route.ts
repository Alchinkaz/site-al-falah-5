import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { username, newPassword } = await request.json()
    if (!username || !newPassword) {
      return NextResponse.json({ ok: false, error: 'username and newPassword are required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ ok: false, error: 'Supabase env vars are missing' }, { status: 500 })
    }

    const admin = createClient(supabaseUrl, serviceKey)

    const { data, error } = await admin
      .from('users')
      .update({ password_hash: newPassword, updated_at: new Date().toISOString() })
      .eq('username', username)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, user: data })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
