import { ProjectService } from "./supabase-services"

export interface PortfolioProject {
  id: string
  slug?: string
  title: string
  description: string
  badges?: Array<{ label: string; color: string }>
  investmentYear: number
  image: string
  contentImage?: string
  published: boolean
  show_on_homepage?: boolean
  createdAt: string
  contentSections?: {
    title?: string
    text: string
  }[]
}

async function mapProjects(): Promise<PortfolioProject[]> {
  const projects = await ProjectService.getAllProjects()
  return projects
    .filter((n: any) => n.published)
    .map((n: any) => ({
      id: n.id,
      slug: n.slug || n.id,
      title: n.title,
      description: n.description || "",
      badges: n.badges || [],
      investmentYear: n.investment_year || new Date(n.created_at).getFullYear(),
      image: n.image || "",
      contentImage: n.content_image || n.image || "",
      published: n.published,
      show_on_homepage: n.show_on_homepage,
      createdAt: n.created_at,
      contentSections: n.content_sections || (n.content ? [{ text: n.content }] : []),
    }))
}

export async function getPublishedProjects(): Promise<PortfolioProject[]> {
  return await mapProjects()
}

export async function getProjectWithDetails(slugOrId: string): Promise<PortfolioProject | null> {
  // Reject old ID patterns (p1, p2, p3, etc.) - only accept proper slugs
  if (/^p\d+$/.test(slugOrId)) {
    console.log(` Rejected old ID pattern: ${slugOrId}`)
    return null
  }

  const projects = await mapProjects()
  // Only match by slug, not by id
  return projects.find((project) => project.slug === slugOrId) || null
}

export function formatProjectDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}
