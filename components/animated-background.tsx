"use client"

import { useEffect, useState } from "react"
import { getHomepageData } from "@/lib/homepage-data"
import type { HomepageData } from "@/lib/homepage-data"

export default function AnimatedBackground({
  homepageData: initialHomepageData,
}: { homepageData?: HomepageData | null } = {}) {
  const [bg, setBg] = useState<string>(initialHomepageData?.heroImage || "/hero-bg.jpg")

  useEffect(() => {
    // If data was provided as prop, don't fetch on mount
    if (initialHomepageData) {
      return
    }

    const loadData = async () => {
      try {
        const data = await getHomepageData()
        if (data?.heroImage) setBg(data.heroImage)
      } catch (error) {
        console.error("Error loading homepage data:", error)
      }
    }

    loadData()

    const onUpdate = async () => {
      try {
        const fresh = await getHomepageData()
        setBg(fresh?.heroImage || "/hero-bg.jpg")
      } catch {}
    }
    window.addEventListener("homepage-data-updated", onUpdate)
    return () => window.removeEventListener("homepage-data-updated", onUpdate)
  }, [initialHomepageData])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/hero-bg.jpg)",
          backgroundSize: "1532px",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  )
}
