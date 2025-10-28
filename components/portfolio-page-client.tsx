"use client"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getPublishedProjects, formatProjectDate } from "@/lib/portfolio-data"
import { useEffect, useState } from "react"
import { readLang, formatDateByLang } from "@/lib/i18n"
import { getAllProjectTranslations, type ProjectTranslations } from "@/lib/project-translations"

interface PortfolioPageClientProps {
  initialTranslations: any
  initialProjects: any[]
  initialProjectTranslations: Record<string, ProjectTranslations>
}

export default function PortfolioPageClient({
  initialTranslations,
  initialProjects,
  initialProjectTranslations,
}: PortfolioPageClientProps) {
  const [projectsData, setProjectsData] = useState<any[]>(initialProjects)
  const [lang, setLang] = useState(readLang())
  const [translations, setTranslations] = useState(initialTranslations)
  const [projectTranslations, setProjectTranslations] =
    useState<Record<string, ProjectTranslations>>(initialProjectTranslations)

  const portfolioI18n = translations.portfolioI18n || {}
  const portfolioTitle = portfolioI18n.heroTitle?.[lang] || "Our Portfolio"
  const portfolioSubtitle =
    portfolioI18n.heroSubtitle?.[lang] ||
    "Discover our portfolio of innovative companies transforming industries across Central Asia"

  useEffect(() => {
    const reload = async () => {
      try {
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
        setProjectsData(formattedProjects)

        const projectIds = formattedProjects.map((p: any) => p.id)
        const translations = await getAllProjectTranslations(projectIds)
        setProjectTranslations(translations)
      } catch (error) {
        console.error("Error reloading projects:", error)
      }
    }
    window.addEventListener("projects-updated", reload as EventListener)
    return () => window.removeEventListener("projects-updated", reload as EventListener)
  }, [])

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
      try {
        const response = await fetch("/api/admin/translations/get")
        if (response.ok) {
          const data = await response.json()
          setTranslations(data.translations || data)
        }
      } catch (error) {
        console.error("Error reloading translations:", error)
      }
    }
    window.addEventListener("translations-updated", reloadTranslations as EventListener)
    return () => window.removeEventListener("translations-updated", reloadTranslations as EventListener)
  }, [])

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

      {/* Hero Section */}
      <section className="relative bg-transparent py-12 mt-12 pt-28 pb-5">
        <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{portfolioTitle}</h1>
            <p className="text-xl text-gray-600 leading-relaxed">{portfolioSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 bg-transparent">
        <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          {projectsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No projects available</p>
            </div>
          ) : (
            <>
              {/* Large screens - 3 columns */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                  {projectsData.map((item, index) => (
                    <div key={item.id} className="lg:col-span-1 group">
                      <Link href={`/portfolio/${item.slug}`} className="block">
                        <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 h-52">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={600}
                            height={400}
                            loading="lazy"
                            quality={75}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                      </Link>
                      <div className="mt-4 flex flex-col h-40">
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {(item.badges || []).map((b: any, i: number) => {
                            const badgeTranslation = projectTranslations[item.id]?.badges?.[i]?.[lang]
                            return (
                              <span
                                key={i}
                                className="text-sm px-3 py-1 rounded-full"
                                style={{
                                  backgroundColor: `${b.color}20`,
                                  color: b.color,
                                  border: `1px solid ${b.color}40`,
                                }}
                              >
                                {badgeTranslation || b.label}
                              </span>
                            )
                          })}
                        </div>
                        <h3 className="text-black font-semibold text-2xl mb-2 leading-tight line-clamp-2 overflow-hidden flex-grow">
                          <Link
                            href={`/portfolio/${item.slug}`}
                            className="hover:text-blue-600 transition-colors block line-clamp-2 overflow-hidden"
                          >
                            {projectTranslations[item.id]?.title[lang] || item.title}
                          </Link>
                        </h3>
                        <p className="text-gray-500 text-sm mt-0.5 md:mt-auto">{formatDateByLang(item.date, lang)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medium screens - 2 columns */}
              <div className="hidden md:block lg:hidden">
                <div className="grid grid-cols-2 gap-6 mb-12">
                  {projectsData.map((item) => (
                    <div key={item.id} className="aspect-[16/9] group">
                      <Link href={`/portfolio/${item.slug}`} className="block h-full">
                        <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 h-full">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={600}
                            height={400}
                            loading="lazy"
                            quality={75}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                      </Link>
                      <div className="mt-3 flex flex-col h-36">
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {(item.badges || []).map((b: any, i: number) => {
                            const badgeTranslation = projectTranslations[item.id]?.badges?.[i]?.[lang]
                            return (
                              <span
                                key={i}
                                className="text-sm px-2 py-1 rounded-full"
                                style={{
                                  backgroundColor: `${b.color}20`,
                                  color: b.color,
                                  border: `1px solid ${b.color}40`,
                                }}
                              >
                                {badgeTranslation || b.label}
                              </span>
                            )
                          })}
                        </div>
                        <h3 className="text-black font-semibold text-2xl md:text-2xl mb-1 leading-tight line-clamp-2 overflow-hidden flex-grow">
                          <Link
                            href={`/portfolio/${item.slug}`}
                            className="hover:text-blue-600 transition-colors block line-clamp-2 overflow-hidden"
                          >
                            {projectTranslations[item.id]?.title[lang] || item.title}
                          </Link>
                        </h3>
                        <p className="text-gray-500 text-xs mt-0.5 md:mt-auto">{formatDateByLang(item.date, lang)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile - 1 column */}
              <div className="md:hidden mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {projectsData.map((item) => (
                    <div key={item.id} className="aspect-[16/9] group">
                      <Link href={`/portfolio/${item.slug}`} className="block h-full">
                        <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 h-full">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={600}
                            height={400}
                            loading="lazy"
                            quality={75}
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                      </Link>
                      <div className="mt-3 flex flex-col h-36">
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {(item.badges || []).map((b: any, i: number) => {
                            const badgeTranslation = projectTranslations[item.id]?.badges?.[i]?.[lang]
                            return (
                              <span
                                key={i}
                                className="text-sm px-2 py-1 rounded-full"
                                style={{
                                  backgroundColor: `${b.color}20`,
                                  color: b.color,
                                  border: `1px solid ${b.color}40`,
                                }}
                              >
                                {badgeTranslation || b.label}
                              </span>
                            )
                          })}
                        </div>
                        <h3 className="text-black font-semibold text-2xl md:text-2xl mb-1 leading-tight line-clamp-2 overflow-hidden flex-grow">
                          <Link
                            href={`/portfolio/${item.slug}`}
                            className="hover:text-blue-600 transition-colors block line-clamp-2 overflow-hidden"
                          >
                            {projectTranslations[item.id]?.title[lang] || item.title}
                          </Link>
                        </h3>
                        <p className="text-gray-500 text-xs mt-0.5 md:mt-auto">{formatDateByLang(item.date, lang)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
