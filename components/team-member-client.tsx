"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { readLang } from "@/lib/i18n"
import type { TeamMemberData } from "@/lib/team-data"

interface TeamMemberClientProps {
  memberData: TeamMemberData | null
  fallbackData: {
    firstName: string
    lastName: string
    role: string
    photo?: string
    bioLeft: string
    bioRight: string
  } | null
  slug: string
}

export default function TeamMemberClient({ memberData: initialMemberData, fallbackData, slug }: TeamMemberClientProps) {
  const [lang, setLang] = useState(readLang())
  const [memberData, setMemberData] = useState(initialMemberData)

  useEffect(() => {
    const handler = (e: any) => setLang(e.detail?.lang || readLang())
    window.addEventListener("language-changed", handler)
    return () => window.removeEventListener("language-changed", handler)
  }, [])

  useEffect(() => {
    const force = () => setLang(readLang())
    window.addEventListener("i18n-updated", force as EventListener)
    return () => window.removeEventListener("i18n-updated", force as EventListener)
  }, [])

  useEffect(() => {
    const reloadMemberData = async () => {
      try {
        const response = await fetch(`/api/team/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setMemberData(data)
        }
      } catch (error) {
        console.error(" Error reloading team member data:", error)
      }
    }
    window.addEventListener("team-data-updated", reloadMemberData as EventListener)
    return () => window.removeEventListener("team-data-updated", reloadMemberData as EventListener)
  }, [slug])

  if (!memberData && !fallbackData) {
    return (
      <div
        className="min-h-screen"
        style={{
          backgroundImage: "url(/bg-white.png)",
          backgroundSize: "1532px", // Increased from 800px to 1200px for larger pattern
          backgroundPosition: "center top",
          backgroundRepeat: "repeat",
        }}
      >
        <Navbar forceScrolled={true} />
        <div className="h-16 sm:h-16 md:h-16 lg:h-20" />
        <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-16">
          <h1 className="text-2xl font-semibold text-gray-900">Member not found</h1>
        </div>
        <Footer />
      </div>
    )
  }

  const displayName =
    memberData?.name[lang] || (fallbackData ? `${fallbackData.firstName} ${fallbackData.lastName}` : "")
  const displayRole = memberData?.role[lang] || fallbackData?.role || ""
  const displayBioLeft = memberData?.bioLeft[lang] || fallbackData?.bioLeft || ""
  const displayBioRight = memberData?.bioRight[lang] || fallbackData?.bioRight || ""
  const displayPhoto = memberData?.photo || fallbackData?.photo || "/placeholder.svg"

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url(/bg-white.png)",
        backgroundSize: "1200px", // Increased from 800px to 1200px for larger pattern
        backgroundPosition: "center top",
        backgroundRepeat: "repeat",
      }}
    >
      <Navbar forceScrolled={true} />
      <div className="h-16 sm:h-16 md:h-16 lg:h-20" />

      <section className="py-10">
        <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#1e1a61] text-white rounded-2xl p-6 md:p-10">
              <h1 className="text-5xl md:text-6xl font-medium leading-tight">
                {(() => {
                  const parts = displayName.split(" ")
                  return (
                    <>
                      {parts[0]}
                      <br />
                      {parts.slice(1).join(" ")}
                    </>
                  )
                })()}
              </h1>
              <div className="mt-6 uppercase tracking-wide text-xs">{displayRole}</div>
            </div>
            <div className="rounded-2xl overflow-hidden bg-[#d2efe6]">
              <Image
                src={displayPhoto || "/placeholder.svg"}
                alt={displayName}
                width={800}
                height={800}
                priority
                quality={85}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mt-10 text-gray-700 text-lg leading-relaxed">
            <p>{displayBioLeft}</p>
            <p>{displayBioRight}</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
