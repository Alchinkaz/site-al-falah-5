import { type NextRequest, NextResponse } from "next/server"
import { getProjectWithDetails } from "@/lib/portfolio-data"
import { getProjectTranslations } from "@/lib/project-translations"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await getProjectWithDetails(params.id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const translations = await getProjectTranslations(project.id)

    return NextResponse.json({
      project,
      translations: translations || {
        title: { en: "", ru: "", kz: "" },
        badges: [],
        sections: { en: [], ru: [], kz: [] },
      },
    })
  } catch (error) {
    console.error(" Error fetching project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
