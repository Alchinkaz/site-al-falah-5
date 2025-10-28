"use client"

import { TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useEffect, useState } from "react"
import { readLang } from "@/lib/i18n"

interface PortfolioDetailClientPageProps {
  initialProject: any
  initialTranslations: {
    title?: { en: string; ru: string; kz: string }
    badges?: Array<{ en: string; ru: string; kz: string }>
    sections?: {
      en: Array<{ title: string; text: string }>
      ru: Array<{ title: string; text: string }>
      kz: Array<{ title: string; text: string }>
    }
  }
}

export default function PortfolioDetailClientPage({
  initialProject,
  initialTranslations,
}: PortfolioDetailClientPageProps) {
  const [lang, setLang] = useState(readLang())
  const project = initialProject
  const [translations, setTranslations] = useState(initialTranslations)

  useEffect(() => {
    const handler = (e: any) => {
      const newLang = e.detail?.lang || readLang()
      setLang(newLang)
    }
    window.addEventListener("language-changed", handler)
    return () => window.removeEventListener("language-changed", handler)
  }, [])

  useEffect(() => {
    const reloadTranslations = async () => {
      if (!project?.id) return

      try {
        const response = await fetch(`/api/admin/translations/project?id=${project.id}`)
        if (response.ok) {
          const data = await response.json()
          setTranslations(data)
        }
      } catch (error) {
        console.error(" Error reloading project translations:", error)
      }
    }

    reloadTranslations()
  }, [lang, project?.id])

  const projectTitle = translations.title?.[lang] || project.title
  const projectBadges = translations.badges || []
  const projectSections = translations.sections?.[lang] || []

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

      <div className="h-14"></div>

      <section className="py-12 bg-transparent pt-24">
        <div className="max-w-[22rem] sm:max-w-md md:max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{projectTitle}</h1>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {(project as any).badges?.map((b: any, i: number) => (
                <span
                  key={i}
                  className="text-sm px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${b.color}20`, color: b.color, border: `1px solid ${b.color}40` }}
                >
                  {projectBadges[i]?.[lang] || b.label}
                </span>
              ))}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              {lang === "ru" ? "Инвестировано в" : lang === "kz" ? "Инвестиция жылы" : "Invested in"}{" "}
              {project.investmentYear}
            </div>
          </div>

          {project.contentImage && (
            <div className="w-full mb-12">
              <Image
                src={project.contentImage || "/placeholder.svg"}
                alt={projectTitle}
                width={1200}
                height={600}
                loading="lazy"
                quality={80}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
                className="w-full h-auto rounded-lg aspect-video object-cover"
              />
            </div>
          )}

          <div className="space-y-12">
            {projectSections.length > 0
              ? projectSections.map((section: any, index: number) => (
                  <div key={index} className="prose prose-lg max-w-none">
                    {section.title && (
                      <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
                      </div>
                    )}
                    {section.text && (
                      <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line mb-8">
                        <p className="mb-4">{section.text}</p>
                      </div>
                    )}
                  </div>
                ))
              : project.contentSections?.map((section: any, index: number) => (
                  <div key={index} className="prose prose-lg max-w-none">
                    {section.title && (
                      <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
                      </div>
                    )}
                    {section.text && (
                      <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line mb-8">
                        <p className="mb-4">{section.text}</p>
                      </div>
                    )}
                  </div>
                ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/portfolio"
              className="inline-flex items-center text-[#1e1a61] hover:text-[#16124a] font-semibold transition-colors"
            >
              ← {lang === "ru" ? "Назад к портфолио" : lang === "kz" ? "Портфолиоға оралу" : "Back to Portfolio"}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
