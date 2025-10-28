"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useCounterAnimation } from "@/hooks/use-counter-animation"
import AnimatedBackground from "@/components/animated-background"
import Link from "next/link"
import { i18n, readLang, formatDateByLang } from "@/lib/i18n"
import type { HomepageData } from "@/lib/homepage-data"
import type { ProjectTranslations } from "@/lib/project-translations"
import Footer from "@/components/footer"

interface HomePageClientProps {
  homepageData: HomepageData | null
  translations: any
  homeProjects: any[]
  projectTranslations: Record<string, ProjectTranslations>
}

export default function HomePageClient({
  homepageData: initialHomepageData,
  translations: initialTranslations,
  homeProjects: initialHomeProjects,
  projectTranslations: initialProjectTranslations,
}: HomePageClientProps) {
  const [currentReview, setCurrentReview] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [homepageData, setHomepageData] = useState<HomepageData | null>(initialHomepageData)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageVisible, setIsImageVisible] = useState(true)
  const [homeProjects, setHomeProjects] = useState<any[]>(initialHomeProjects)
  const [lang, setLang] = useState(readLang())
  const [translations, setTranslations] = useState<any>(initialTranslations)
  const [projectTranslations, setProjectTranslations] =
    useState<Record<string, ProjectTranslations>>(initialProjectTranslations)

  const stat1Counter = useCounterAnimation({
    end: homepageData?.stat1Title ? Number.parseInt(homepageData.stat1Title.replace(/[^\d]/g, "") || "0") : 0,
  })
  const stat2Counter = useCounterAnimation({
    end: homepageData?.stat2Title ? Number.parseInt(homepageData.stat2Title.replace(/[^\d]/g, "") || "0") : 0,
  })
  const stat3Counter = useCounterAnimation({
    end: homepageData?.stat3Title ? Number.parseInt(homepageData.stat3Title.replace(/[^\d]/g, "") || "0") : 0,
  })

  useEffect(() => {
    const handleI18nUpdate = async () => {
      try {
        const response = await fetch("/api/admin/translations/get", { cache: "no-store" })
        if (response.ok) {
          const data = await response.json()
          setTranslations(data.translations || data)
        }
      } catch (error) {
        console.error(" Error loading translations:", error)
      }
    }

    window.addEventListener("i18n-updated", handleI18nUpdate as EventListener)

    return () => {
      window.removeEventListener("i18n-updated", handleI18nUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    const handleDataUpdate = async () => {
      try {
        const { getHomepageData } = await import("@/lib/homepage-data")
        const fresh = await getHomepageData(true)
        setHomepageData(fresh)
      } catch (e) {
        // keep previous data on fetch error
      }
    }

    window.addEventListener("homepage-data-updated", handleDataUpdate as EventListener)

    return () => {
      window.removeEventListener("homepage-data-updated", handleDataUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    const handler = (e: any) => setLang(e.detail?.lang || readLang())
    if (typeof window !== "undefined") {
      window.addEventListener("language-changed", handler)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("language-changed", handler)
      }
    }
  }, [])

  useEffect(() => {
    const reloadProjects = async () => {
      try {
        const { getPublishedProjects, formatProjectDate } = await import("@/lib/portfolio-data")
        const { getAllProjectTranslations } = await import("@/lib/project-translations")

        const published = await getPublishedProjects()
        const filtered = published.filter((p: any) => p.show_on_homepage)
        const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        const formatted = sorted.slice(0, 6).map((p: any) => ({
          id: p.id,
          slug: p.slug || p.id,
          title: p.title,
          date: formatProjectDate(p.createdAt),
          image: p.image,
          badges: p.badges || [],
          investmentYear: p.investmentYear,
        }))
        setHomeProjects(formatted)

        const projectIds = formatted.map((p: any) => p.id)
        const translations = await getAllProjectTranslations(projectIds)
        setProjectTranslations(translations)
      } catch (error) {
        console.error("Error reloading projects:", error)
      }
    }
    window.addEventListener("projects-updated", reloadProjects as EventListener)
    return () => window.removeEventListener("projects-updated", reloadProjects as EventListener)
  }, [])

  const reviews = homepageData?.reviews || []

  useEffect(() => {
    if (reviews.length === 0) return

    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentReview((prev) => (prev + 1) % reviews.length)
        setIsVisible(true)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [reviews.length])

  useEffect(() => {
    if (!homepageData?.imageGallery || homepageData.imageGallery.length === 0) return

    const interval = setInterval(() => {
      setIsImageVisible(false)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % homepageData.imageGallery.length)
        setIsImageVisible(true)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [homepageData?.imageGallery])

  const t = translations || i18n

  if (!homepageData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="sticky top-0 min-h-screen w-full flex flex-col relative pt-20 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-transparent z-[1] pointer-events-none" />
        <AnimatedBackground homepageData={homepageData} />

        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
            <div className="flex items-center justify-center py-8">
              <div className="max-w-4xl lg:max-w-3xl xl:max-w-4xl text-left">
                <img
                  src="/al-falah-logo-white-text.svg"
                  alt="Al Falah Partners"
                  className="mb-3.5 h-[90px] sm:h-[90px] md:h-[90px] lg:h-[108px] xl:h-[112px] 2xl:h-[120px]"
                />

                <h1
                  className="text-white font-normal mb-6 md:mb-8"
                  style={{
                    fontSize: "clamp(18px, 2.2vw, 24px)",
                    lineHeight: 1.4,
                    wordBreak: "keep-all",
                    overflowWrap: "normal",
                    whiteSpace: "normal",
                  }}
                >
                  {t.heroTitle[lang]}
                </h1>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                  <Link href="/portfolio" prefetch={true}>
                    <button
                      className="bg-white hover:bg-gray-100 text-black font-semibold rounded-xl w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                      style={{
                        height: "clamp(44px, 6.2vw, 48px)",
                        paddingInline: "clamp(20px, 4.5vw, 40px)",
                        fontSize: "clamp(14px, 1.6vw, 16px)",
                      }}
                    >
                      {t.heroButton[lang]}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className="relative z-20 bg-white"
        style={{
          backgroundImage: "url(/bg-white.png)",
          backgroundSize: "1532px",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat",
        }}
      >
        {/* Portfolio Section */}
        <section className="relative pt-24 pb-8" id="portfolio">
          <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
            <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between lg:flex-row lg:items-end lg:justify-between">
              <div className="text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                  {t.homePortfolioTitle?.[lang] || i18n.homePortfolioTitle?.[lang] || "Portfolio"}
                </h2>
                <p className="text-base md:text-lg text-gray-600 max-w-2xl">
                  {t.homePortfolioSubtitle?.[lang] || i18n.homePortfolioSubtitle?.[lang] || "Our portfolio companies"}
                </p>
              </div>
              <Link href="/portfolio" prefetch={true}>
                <Button
                  variant="outline"
                  className="hidden md:block border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 bg-white px-8 mt-6"
                >
                  {t.portfolioViewAll[lang]}
                </Button>
              </Link>
            </div>

            <div className="hidden lg:block">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                {homeProjects.map((item: any) => (
                  <div key={item.id} className="lg:col-span-1">
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white group">
                      <div className="relative w-full h-52 bg-gray-100">
                        <Link href={`/portfolio/${item.slug}`} className="block h-full">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                            loading="lazy"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            quality={75}
                          />
                        </Link>
                      </div>
                      <div className="bg-white px-4 py-3 border-t border-gray-200">
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {(item.badges || []).map((b: any, i: number) => {
                            const badgeTranslation = projectTranslations[item.id]?.badges?.[i]?.[lang]
                            return (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded-full"
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
                        <h3 className="text-black font-semibold text-xl leading-tight mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                          <Link
                            href={`/portfolio/${item.slug}`}
                            className="hover:text-blue-600 transition-colors block whitespace-nowrap overflow-hidden text-ellipsis"
                          >
                            {projectTranslations[item.id]?.title[lang] || item.title}
                          </Link>
                        </h3>
                        <p className="text-gray-500 text-xs">{formatDateByLang(item.date, lang)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:block lg:hidden">
              <div className="grid grid-cols-2 gap-6 mb-12">
                {homeProjects.slice(0, 6).map((item: any) => (
                  <div key={item.id}>
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white group">
                      <div className="relative w-full aspect-[16/9] bg-gray-100">
                        <Link href={`/portfolio/${item.slug}`} className="block h-full">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                            loading="lazy"
                            sizes="(max-width: 1024px) 50vw, 33vw"
                            quality={75}
                          />
                        </Link>
                      </div>
                      <div className="bg-white px-3 py-3 border-t border-gray-200">
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {(item.badges || []).map((b: any, i: number) => {
                            const badgeTranslation = projectTranslations[item.id]?.badges?.[i]?.[lang]
                            return (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded-full"
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
                        <h3 className="text-black font-semibold text-lg mb-1 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                          <Link href={`/portfolio/${item.slug}`} className="hover:text-blue-600 transition-colors block whitespace-nowrap overflow-hidden text-ellipsis">
                            {projectTranslations[item.id]?.title[lang] || item.title}
                          </Link>
                        </h3>
                        <p className="text-gray-500 text-xs">{formatDateByLang(item.date, lang)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:hidden mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {homeProjects.slice(0, 4).map((item: any) => (
                  <div key={item.id}>
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white group">
                      <div className="relative w-full aspect-[16/9] bg-gray-100">
                        <Link href={`/portfolio/${item.slug}`} className="block h-full">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                            quality={85}
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        </Link>
                      </div>
                      <div className="bg-white px-3 py-3 border-t border-gray-200">
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {(item.badges || []).map((b: any, i: number) => {
                            const badgeTranslation = projectTranslations[item.id]?.badges?.[i]?.[lang]
                            return (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded-full"
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
                        <h3 className="text-black font-semibold text-lg mb-1 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                          <Link href={`/portfolio/${item.slug}`} className="hover:text-blue-600 transition-colors block whitespace-nowrap overflow-hidden text-ellipsis">
                            {projectTranslations[item.id]?.title[lang] || item.title}
                          </Link>
                        </h3>
                        <p className="text-gray-500 text-xs">{formatDateByLang(item.date, lang)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Section with company info and statistics */}
        <section id="about" className="relative py-12 pb-24" aria-labelledby="about-heading">
          <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
            <div className="grid xl:grid-cols-2 gap-16 items-start mb-16">
              <div className="order-2 xl:order-1">
                <h2 className="text-4xl font-bold text-gray-900 mb-6 xl:mt-0">{t.aboutTitle[lang]}</h2>
                <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                  {(Array.isArray(t.aboutParagraphs?.[lang])
                    ? t.aboutParagraphs[lang]
                    : Array.isArray(t.aboutPageParagraphs?.[lang])
                      ? t.aboutPageParagraphs[lang]
                      : Array.isArray(i18n.aboutParagraphs?.[lang])
                        ? i18n.aboutParagraphs[lang]
                        : Array.isArray(i18n.aboutPageParagraphs?.[lang])
                          ? i18n.aboutPageParagraphs[lang]
                          : []
                  ).map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="order-1 xl:order-2">
              <div className="relative w-full rounded-lg overflow-hidden border border-gray-200" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={homepageData.aboutImage || "/placeholder.svg"}
                    alt="Currency exchange office"
                    fill
                    className="object-cover rounded-lg"
                    quality={85}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  <div className="text-left relative">
                    <div className="px-4 py-6">
                      <h3 ref={stat1Counter.elementRef} className="text-3xl font-semibold text-gray-900 mb-2">
                        {homepageData?.stat1Title?.replace(/\d+/, stat1Counter.count.toString()) || "0"}
                      </h3>
                      <p className="text-gray-600">{t.stat1Subtitle[lang]}</p>
                    </div>
                    <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-gray-300"></div>
                    <div className="md:hidden w-full h-px bg-gray-300"></div>
                  </div>

                  <div className="text-left relative">
                    <div className="px-4 py-6">
                      <h3 ref={stat2Counter.elementRef} className="text-3xl font-semibold text-gray-900 mb-2">
                        {homepageData?.stat2Title?.replace(/\d+/, stat2Counter.count.toString()) || "0"}
                      </h3>
                      <p className="text-gray-600">{t.stat2Subtitle[lang]}</p>
                    </div>
                    <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-gray-300"></div>
                    <div className="md:hidden w-full h-px bg-gray-300"></div>
                  </div>

                  <div className="text-left relative">
                    <div className="px-4 py-6">
                      <h3 ref={stat3Counter.elementRef} className="text-3xl font-semibold text-gray-900 mb-2">
                        {homepageData?.stat3Title?.replace(/\d+/, stat3Counter.count.toString()) || "0"}
                      </h3>
                      <p className="text-gray-600">{t.stat3Subtitle[lang]}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-2 bg-[rgba(30,26,97,1)]"></div>
            </div>
          </div>
        </section>

        {/* CTA merged into Footer */}
        <Footer homepageData={homepageData} />
      </div>

      <style jsx>{`
        @keyframes gentle-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.6);
          }
        }
      `}</style>
    </>
  )
}
