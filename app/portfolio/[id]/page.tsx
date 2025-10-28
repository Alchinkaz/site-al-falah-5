import PortfolioDetailClientPage from "./client-page"
import { notFound } from "next/navigation"
import { getProjectWithDetails } from "@/lib/portfolio-data"
import { getPublishedProjects } from "@/lib/portfolio-data"

export const revalidate = 60 // Enable ISR with 60 second revalidation

export async function generateStaticParams() {
  const projects = await getPublishedProjects()

  return projects.map((project) => ({
    id: project.slug || project.id,
  }))
}

export default async function PortfolioDetailPage({ params }: { params: { id: string } }) {
  // Block old ID patterns
  if (/^p\d+$/.test(params.id)) {
    console.log(` Blocked access to old ID pattern: ${params.id}`)
    notFound()
  }

  const project = await getProjectWithDetails(params.id)

  if (!project) {
    notFound()
  }

  let translations: any = {
    title: { en: "", ru: "", kz: "" },
    badges: [],
    sections: { en: [], ru: [], kz: [] },
  }

  if (project?.id) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/admin/translations/project?id=${project.id}`,
        { next: { revalidate: 60 } },
      )
      if (response.ok) {
        translations = await response.json()
      }
    } catch (error) {
      console.error(" Error loading project translations:", error)
    }
  }

  return <PortfolioDetailClientPage initialProject={project} initialTranslations={translations} />
}
