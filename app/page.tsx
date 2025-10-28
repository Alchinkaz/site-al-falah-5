import Navbar from "@/components/navbar"
import { getHomepageData } from "@/lib/homepage-data"
import { getPublishedProjects, formatProjectDate } from "@/lib/portfolio-data"
import { getAllProjectTranslations } from "@/lib/project-translations"
import { Suspense } from "react"
import HomePageClient from "@/components/home-page-client"
import { TranslationService } from "@/lib/supabase-services"

export const revalidate = 60

async function getServerData() {
  try {
    // Fetch all data in parallel on the server
    const [homepageData, translations, publishedProjects] = await Promise.all([
      getHomepageData(),
      TranslationService.getTranslations(),
      getPublishedProjects(),
    ])

    // Filter and format projects
    const filtered = publishedProjects.filter((p: any) => p.show_on_homepage)
    const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const homeProjects = sorted.slice(0, 6).map((p: any) => ({
      id: p.id,
      slug: p.slug || p.id,
      title: p.title,
      date: formatProjectDate(p.createdAt),
      image: p.image,
      badges: p.badges || [],
      investmentYear: p.investmentYear,
    }))

    // Fetch project translations
    const projectIds = homeProjects.map((p: any) => p.id)
    const projectTranslations = await getAllProjectTranslations(projectIds)

    return {
      homepageData,
      translations,
      homeProjects,
      projectTranslations,
    }
  } catch (error) {
    console.error(" Error loading server data:", error)
    // Return defaults if there's an error
    return {
      homepageData: null,
      translations: {},
      homeProjects: [],
      projectTranslations: {},
    }
  }
}

export default async function Home() {
  const serverData = await getServerData()

  return (
    <div className="min-h-screen bg-white">
      <Navbar homepageData={serverData.homepageData} />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a0a0a" }}>
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white">Loading...</p>
            </div>
          </div>
        }
      >
        <HomePageClient {...serverData} />
      </Suspense>
    </div>
  )
}
