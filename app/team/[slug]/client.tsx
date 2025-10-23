"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { TeamMemberData } from "@/lib/team-data"
import TeamMemberClient from "@/components/team-member-client"

export default function TeamMemberPageClient({
  memberData,
  fallbackData,
  slug,
}: { memberData: TeamMemberData | null; fallbackData: any | null; slug: string }) {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <TeamMemberClient memberData={memberData} fallbackData={fallbackData} slug={slug} />
      </main>
      <Footer />
    </>
  )
}
