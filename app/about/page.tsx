import { getHomepageData } from "@/lib/homepage-data"
import { getAllTeamMembers } from "@/lib/team-data"
import { supabase } from "@/lib/supabase"
import AboutPageClient from "@/components/about-page-client"

export const revalidate = 60

function processTranslations(data: any[]) {
  console.log(" Processing translations on server:", data?.length, "rows")

  // Group by key
  const grouped: Record<string, Array<{ language: string; value: any }>> = {}

  data?.forEach((row) => {
    const { key, language, value } = row
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push({ language, value })
  })

  // Reconstruct nested structure
  const translations: Record<string, any> = {}

  for (const [key, entries] of Object.entries(grouped)) {
    const parsedEntries = entries.map((entry) => {
      let parsedValue = entry.value
      if (typeof entry.value === "string") {
        // Try to parse JSON strings (arrays and objects)
        if (entry.value.startsWith("[") || entry.value.startsWith("{")) {
          try {
            parsedValue = JSON.parse(entry.value)
          } catch {
            parsedValue = entry.value
          }
        }
      }
      return { language: entry.language, value: parsedValue }
    })

    const firstValue = parsedEntries[0]?.value
    const allSameArray =
      Array.isArray(firstValue) && parsedEntries.every((e) => JSON.stringify(e.value) === JSON.stringify(firstValue))

    if (allSameArray) {
      // If all languages have the same array, store it directly (not as language object)
      translations[key] = firstValue
      console.log(` Loaded array for key ${key}:`, firstValue.length, "items")
    } else if (key.includes(".")) {
      // Nested key like "portfolioI18n.heroTitle"
      const parts = key.split(".")
      let current = translations

      // Navigate/create nested structure
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {}
        }
        current = current[parts[i]]
      }

      // Set the final value as language object
      const finalKey = parts[parts.length - 1]
      current[finalKey] = {}
      parsedEntries.forEach((entry) => {
        current[finalKey][entry.language] = entry.value
      })
    } else {
      // Simple key like "heroTitle"
      translations[key] = {}
      parsedEntries.forEach((entry) => {
        translations[key][entry.language] = entry.value
      })
    }
  }

  return translations
}

export default async function AboutPage() {
  const [homepageData, teamMembers, translationsData] = await Promise.all([
    getHomepageData(),
    getAllTeamMembers(),
    supabase.from("translations").select("*"),
  ])

  const processedTranslations = processTranslations(translationsData.data || [])

  return (
    <AboutPageClient
      initialHomepageData={homepageData}
      initialTeamMembers={teamMembers}
      initialTranslations={processedTranslations}
    />
  )
}
