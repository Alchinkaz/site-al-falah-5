import { type NextRequest, NextResponse } from "next/server"
import { getTeamMemberData } from "@/lib/team-data"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const memberData = await getTeamMemberData(params.slug)

    if (!memberData) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json(memberData)
  } catch (error) {
    console.error(" Error fetching team member:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
