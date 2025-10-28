import { supabase } from "@/lib/supabase"

export interface TeamMemberData {
  slug: string
  name: {
    en: string
    ru: string
    kz: string
  }
  role: {
    en: string
    ru: string
    kz: string
  }
  photo?: string
  bioLeft: {
    en: string
    ru: string
    kz: string
  }
  bioRight: {
    en: string
    ru: string
    kz: string
  }
}

export async function getTeamMemberData(slug: string): Promise<TeamMemberData | null> {
  try {
    const { data: memberData, error: memberError } = await supabase
      .from("team_members")
      .select("photo")
      .eq("slug", slug)
      .single()

    if (memberError) {
      console.error(" Error fetching team member:", memberError)
    }

    const { data, error } = await supabase.from("team_translations").select("*").eq("team_member_slug", slug)

    if (error) {
      console.error(" Error fetching team member data:", error)
      return null
    }

    if (!data || data.length === 0) {
      console.log(" No team data found for slug:", slug)
      return null
    }

    const result: TeamMemberData = {
      slug,
      name: { en: "", ru: "", kz: "" },
      role: { en: "", ru: "", kz: "" },
      bioLeft: { en: "", ru: "", kz: "" },
      bioRight: { en: "", ru: "", kz: "" },
      photo: memberData?.photo || "/placeholder.svg",
    }

    data.forEach((row: any) => {
      const lang = row.language as "en" | "ru" | "kz"
      const type = row.translation_type
      const value = row.value || ""

      if (type === "name") {
        result.name[lang] = value
      } else if (type === "role") {
        result.role[lang] = value
      } else if (type === "bio_left") {
        result.bioLeft[lang] = value
      } else if (type === "bio_right") {
        result.bioRight[lang] = value
      }
    })

    console.log(" Loaded team member data from Supabase:", result)
    return result
  } catch (error) {
    console.error(" Exception fetching team member data:", error)
    return null
  }
}

export async function getAllTeamMembers(): Promise<TeamMemberData[]> {
  try {
    const { data: members, error: membersError } = await supabase
      .from("team_members")
      .select("slug, photo")
      .order("created_at", { ascending: true })

    if (membersError) {
      console.error(" Error fetching team members:", membersError)
      return []
    }

    if (!members || members.length === 0) {
      console.log(" No team members found in database")
      return []
    }

    const { data, error } = await supabase.from("team_translations").select("*")

    if (error) {
      console.error(" Error fetching all team translations:", error)
      return []
    }

    const memberMap = new Map<string, TeamMemberData>()

    members.forEach((member) => {
      memberMap.set(member.slug, {
        slug: member.slug,
        name: { en: "", ru: "", kz: "" },
        role: { en: "", ru: "", kz: "" },
        bioLeft: { en: "", ru: "", kz: "" },
        bioRight: { en: "", ru: "", kz: "" },
        photo: member.photo || "/placeholder.svg",
      })
    })

    if (data) {
      data.forEach((row: any) => {
        const slug = row.team_member_slug
        if (!memberMap.has(slug)) {
          memberMap.set(slug, {
            slug,
            name: { en: "", ru: "", kz: "" },
            role: { en: "", ru: "", kz: "" },
            bioLeft: { en: "", ru: "", kz: "" },
            bioRight: { en: "", ru: "", kz: "" },
          })
        }

        const member = memberMap.get(slug)!
        const lang = row.language as "en" | "ru" | "kz"
        const type = row.translation_type
        const value = row.value || ""

        if (type === "name") {
          member.name[lang] = value
        } else if (type === "role") {
          member.role[lang] = value
        } else if (type === "bio_left") {
          member.bioLeft[lang] = value
        } else if (type === "bio_right") {
          member.bioRight[lang] = value
        }
      })
    }

    const result = Array.from(memberMap.values())
    console.log(" Loaded all team members from Supabase:", result.length)
    return result
  } catch (error) {
    console.error(" Exception fetching all team members:", error)
    return []
  }
}
