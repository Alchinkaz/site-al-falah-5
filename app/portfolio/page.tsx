import { createClient } from "@/lib/supabase/server"
import { getPublishedProjects, formatProjectDate } from "@/lib/portfolio-data"
import { getAllProjectTranslations } from "@/lib/project-translations"
import PortfolioPageClient from "@/components/portfolio-page-client"

export const revalidate = 60 // Revalidate every 60 seconds

async function getPortfolioData() {
  const supabase = await createClient()

  // Fetch translations
  const { data: translationsData } = await supabase.from("translations").select("*")

  // Process translations similar to the API route
  const translationsObj: any = {}
  const arrayKeys = new Set<string>()

  if (translationsData) {
    translationsData.forEach((row: any) => {
      const key = row.key
      let value = row.value

      // Try to parse JSON
      try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed) || typeof parsed === "object") {
          value = parsed
          arrayKeys.add(key)
        }
      } catch {
        // Not JSON, keep as string
      }

      if (!translationsObj[key]) {
        translationsObj[key] = { en: "", ru: "", kz: "" }
      }
      translationsObj[key][row.language] = value
    })

    // For array keys, if all languages have the same array, store it directly
    arrayKeys.forEach((key) => {
      const enVal = translationsObj[key].en
      const ruVal = translationsObj[key].ru
      const kzVal = translationsObj[key].kz

      if (
        Array.isArray(enVal) &&
        Array.isArray(ruVal) &&
        Array.isArray(kzVal) &&
        JSON.stringify(enVal) === JSON.stringify(ruVal) &&
        JSON.stringify(ruVal) === JSON.stringify(kzVal)
      ) {
        translationsObj[key] = enVal
      }
    })
  }

  const nestedTranslations: any = {}
  Object.keys(translationsObj).forEach((key) => {
    const parts = key.split(".")
    let current = nestedTranslations
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {}
      }
      current = current[parts[i]]
    }
    current[parts[parts.length - 1]] = translationsObj[key]
  })

  // Fetch projects
  const publishedProjects = await getPublishedProjects()
  const sorted = [...publishedProjects].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  const formattedProjects = sorted.map((project: any) => ({
    id: project.id,
    slug: project.slug || project.id,
    title: project.title,
    description: project.description,
    badges: project.badges || [],
    investmentYear: project.investmentYear,
    date: formatProjectDate(project.createdAt),
    image: project.image,
  }))

  // Fetch project translations
  const projectIds = formattedProjects.map((p: any) => p.id)
  const projectTranslations = await getAllProjectTranslations(projectIds)

  return {
    translations: nestedTranslations,
    projects: formattedProjects,
    projectTranslations,
  }
}

export default async function PortfolioPage() {
  const data = await getPortfolioData()

  return (
    <PortfolioPageClient
      initialTranslations={data.translations}
      initialProjects={data.projects}
      initialProjectTranslations={data.projectTranslations}
    />
  )
}
