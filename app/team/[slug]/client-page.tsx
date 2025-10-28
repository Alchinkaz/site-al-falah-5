"use client"

import TeamMemberClient from "@/components/team-member-client"
import type { TeamMemberData } from "@/lib/team-data"

interface MemberData {
  firstName: string
  lastName: string
  role: string
  photo?: string
  bioLeft: string
  bioRight: string
}

interface ClientPageProps {
  memberData: TeamMemberData | null
  fallbackData: MemberData | null
  slug: string
}

export default function TeamMemberClientPage({ memberData, fallbackData, slug }: ClientPageProps) {
  return <TeamMemberClient memberData={memberData} fallbackData={fallbackData} slug={slug} />
}
