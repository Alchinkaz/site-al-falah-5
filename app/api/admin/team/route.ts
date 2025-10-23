import { NextResponse } from "next/server"
import { TeamService } from "@/lib/supabase-services"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log(" POST /api/admin/team - Received body:", body)

    if (body.slug && body.type && body.language && body.value !== undefined) {
      const { slug, type, language, value } = body
      console.log(` Updating ${type} for ${slug} (${language}):`, value)

      const success = await TeamService.updateTeamTranslation(
        slug,
        type as "name" | "role" | "bio_left" | "bio_right",
        language as "en" | "ru" | "kz",
        value,
      )

      if (!success) {
        throw new Error(`Failed to update ${type} for ${slug}`)
      }

      console.log(` Successfully updated ${type} for ${slug} (${language})`)

      revalidatePath("/about")
      revalidatePath(`/team/${slug}`)

      return NextResponse.json({ ok: true })
    }

    if (body.slug && body.photo !== undefined) {
      const { slug, photo } = body
      console.log(` Updating photo for ${slug}:`, photo)

      const success = await TeamService.updateTeamMemberPhoto(slug, photo)

      if (!success) {
        throw new Error(`Failed to update photo for ${slug}`)
      }

      console.log(` Successfully updated photo for ${slug}`)

      revalidatePath("/about")
      revalidatePath(`/team/${slug}`)

      return NextResponse.json({ ok: true })
    }

    // Legacy bulk update format (keep for backward compatibility)
    const { teamPhotos, teamNames, teamI18n } = body

    if (teamPhotos) {
      for (const [slug, photo] of Object.entries(teamPhotos as Record<string, string>)) {
        console.log(` Saving photo for ${slug}:`, photo)
        await TeamService.updateTeamMemberPhoto(slug, photo)
      }
    }

    if (teamNames) {
      for (const [slug, names] of Object.entries(teamNames as Record<string, any>)) {
        console.log(` Saving names for ${slug}`)
        for (const [lang, name] of Object.entries(names as Record<string, string>)) {
          if (lang === "en" || lang === "ru" || lang === "kz") {
            await TeamService.updateTeamTranslation(slug, "name", lang, name)
          }
        }
      }
    }

    if (teamI18n) {
      for (const [slug, data] of Object.entries(teamI18n as Record<string, any>)) {
        console.log(` Saving i18n for ${slug}`)

        if (data.role) {
          for (const [lang, role] of Object.entries(data.role as Record<string, string>)) {
            if (lang === "en" || lang === "ru" || lang === "kz") {
              await TeamService.updateTeamTranslation(slug, "role", lang, role)
            }
          }
        }

        if (data.bioLeft) {
          for (const [lang, bio] of Object.entries(data.bioLeft as Record<string, string>)) {
            if (lang === "en" || lang === "ru" || lang === "kz") {
              await TeamService.updateTeamTranslation(slug, "bio_left", lang, bio)
            }
          }
        }

        if (data.bioRight) {
          for (const [lang, bio] of Object.entries(data.bioRight as Record<string, string>)) {
            if (lang === "en" || lang === "ru" || lang === "kz") {
              await TeamService.updateTeamTranslation(slug, "bio_right", lang, bio)
            }
          }
        }
      }
    }

    console.log(" All team data saved successfully to team_translations table")

    revalidatePath("/about")
    revalidatePath("/team")

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error(" Team API error:", e)
    return NextResponse.json({ error: e?.message || "Internal server error" }, { status: 500 })
  }
}
