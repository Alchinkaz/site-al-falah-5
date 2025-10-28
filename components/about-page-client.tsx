"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getHomepageData, type HomepageData } from "@/lib/homepage-data"
import { useCounterAnimation } from "@/hooks/use-counter-animation"
import { aboutI18n, readLang, i18n } from "@/lib/i18n"
import { getAllTeamMembers, type TeamMemberData } from "@/lib/team-data"

interface AboutPageClientProps {
  initialHomepageData: HomepageData | null
  initialTeamMembers: TeamMemberData[]
  initialTranslations: any // Now receives processed translations object instead of array
}

export default function AboutPageClient({
  initialHomepageData,
  initialTeamMembers,
  initialTranslations,
}: AboutPageClientProps) {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(initialHomepageData)
  const [lang, setLang] = useState(readLang())
  const [translations, setTranslations] = useState<any>(initialTranslations)
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>(initialTeamMembers)

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
    const loadTranslations = async () => {
      try {
        const response = await fetch("/api/admin/translations/get")
        if (response.ok) {
          const data = await response.json()
          setTranslations(data.translations)
        }
      } catch (error) {
        console.error(" Error loading translations:", error)
      }
    }

    const handleDataUpdate = async () => {
      try {
        const fresh = await getHomepageData()
        setHomepageData(fresh)
      } catch (e) {
        // keep previous state
      }
    }

    const handleI18nUpdate = async () => {
      await loadTranslations()
    }

    const handleLanguageChange = (e: any) => {
      setLang(e.detail?.lang || readLang())
    }

    const reloadTeamMembers = async () => {
      try {
        const members = await getAllTeamMembers()
        setTeamMembers(members)
      } catch (error) {
        console.error(" Error reloading team members:", error)
      }
    }

    window.addEventListener("homepage-data-updated", handleDataUpdate as EventListener)
    window.addEventListener("i18n-updated", handleI18nUpdate as EventListener)
    window.addEventListener("language-changed", handleLanguageChange)
    window.addEventListener("team-data-updated", reloadTeamMembers as EventListener)

    return () => {
      window.removeEventListener("homepage-data-updated", handleDataUpdate as EventListener)
      window.removeEventListener("i18n-updated", handleI18nUpdate as EventListener)
      window.removeEventListener("language-changed", handleLanguageChange)
      window.removeEventListener("team-data-updated", reloadTeamMembers as EventListener)
    }
  }, [])

  const t = translations || i18n

  const keyTermsRows = Array.isArray(t.aboutPageKeyTermsRows) ? t.aboutPageKeyTermsRows : []
  const sectors = Array.isArray(t.aboutPageSectors)
    ? t.aboutPageSectors
    : Array.isArray(aboutI18n.sectors)
      ? aboutI18n.sectors
      : []

  const displayTeamMembers =
    teamMembers.length > 0
      ? teamMembers
      : [
          {
            slug: "nurlan-kussainov",
            name: { en: "Nurlan Kussainov", ru: "Нурлан Кусаинов", kz: "Нұрлан Құсайынов" },
            role: { en: "Managing Partner", ru: "Управляющий партнер", kz: "Басқарушы серіктес" },
            bioLeft: { en: "Mr. Nurlan Kussainov has over 20 years...", ru: "", kz: "" },
            bioRight: { en: "", ru: "", kz: "" },
          },
          {
            slug: "diyar-medeubekov",
            name: { en: "Diyar Medeubekov", ru: "Дияр Медеубеков", kz: "Дияр Медеубеков" },
            role: {
              en: "Chief Investment Officer",
              ru: "Главный инвестиционный офицер",
              kz: "Орташа инвестициялық ортасы",
            },
            bioLeft: { en: "Mr. Medeubekov used to manage portfolio companies...", ru: "", kz: "" },
            bioRight: { en: "", ru: "", kz: "" },
          },
          {
            slug: "altay-mamanbayev",
            name: { en: "Altay Mamanbayev", ru: "Алтай Маманбайев", kz: "Алтай Маманбайев" },
            role: {
              en: "Chief Operating Officer",
              ru: "Главный операционный директор",
              kz: "Орташа операциялық ортасы",
            },
            bioLeft: { en: "Mr. Mamanbayev manages the operations of the fund...", ru: "", kz: "" },
            bioRight: { en: "", ru: "", kz: "" },
          },
          {
            slug: "azhar-babayeva",
            name: { en: "Azhar Babayeva", ru: "Азхар Бабаева", kz: "Азхар Бабаева" },
            role: { en: "Reporting Manager", ru: "Менеджер по отчетности", kz: "Еңбей ортасы" },
            bioLeft: { en: "Ms. Azhar Babayeva is Reporting Manager and joined the company...", ru: "", kz: "" },
            bioRight: { en: "", ru: "", kz: "" },
          },
        ]

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
      <div className="h-16 sm:h-16 md:h-16 lg:h-20"></div>

      {/* Top hero image block within site max-width, with slightly reduced top spacing and height */}
      <section className="bg-transparent mt-8 sm:mt-10 lg:mt-12 xl:mt-14">
        <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="relative w-full rounded-2xl overflow-hidden mb-4" style={{ aspectRatio: "21/9" }}>
            <Image
              src={homepageData?.aboutImage || "/placeholder.svg"}
              alt="About cover"
              width={1400}
              height={600}
              priority
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1400px"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Removed hero heading & subtitle per request */}

      {/* Company Intro */}
      <section className="pt-8 pb-12 bg-transparent">
        <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="grid xl:grid-cols-2 gap-12">
            <div className="space-y-5 text-gray-700 text-lg leading-relaxed">
              <h3 className="text-3xl font-semibold text-gray-900 mb-2 hidden">
                {t.aboutPageTitle?.[lang] || aboutI18n.title[lang]}
              </h3>
              {(Array.isArray(t.aboutPageParagraphs?.[lang])
                ? t.aboutPageParagraphs[lang]
                : aboutI18n.paragraphs[lang] || []
              ).map((p: string, idx: number) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t.aboutPageKeyTermsTitle?.[lang] || aboutI18n.keyTermsTitle[lang]}
                </h3>
                <ul className="text-gray-700 divide-y divide-gray-200 border-t border-b border-gray-200">
                  {keyTermsRows.map((row: any, idx: number) => (
                    <li key={idx} className="flex justify-between gap-4 py-3">
                      <span className="text-gray-500">{row.label?.[lang] || ""}:</span>
                      <span className="text-gray-900 font-medium">{row.value?.[lang] || ""}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t.aboutPageSectorsTitle?.[lang] || aboutI18n.sectorsTitle[lang]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectors.map((item: any, idx: number) => (
                    <div key={item.key || idx} className="rounded-lg border border-gray-200 p-4 bg-white">
                      <div className="text-lg font-semibold text-gray-900 mb-1">{item.title[lang]}</div>
                      <div className="text-gray-600 text-sm leading-relaxed">{item.desc[lang]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section (animated) */}
      <section className="relative py-12 bg-transparent">
        <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
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

      {/* Team */}
      <section className="py-12 bg-transparent">
        <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between lg:flex-row lg:items-end lg:justify-between">
            <div className="text-left">
              <h3 className="font-bold text-gray-900 text-3xl md:text-[48px] md:leading-[1.1]">
                {t.teamTitle?.[lang] || aboutI18n.teamTitle[lang]}
              </h3>
            </div>
            {/* Button removed per request */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {displayTeamMembers.map((member) => (
              <div key={member.slug} className="lg:col-span-1">
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                  <div className="relative w-full aspect-square">
                    <Image
                      src={member.photo || "/placeholder.svg"}
                      alt={member.name[lang]}
                      width={600}
                      height={600}
                      loading="lazy"
                      quality={80}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 400px"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="bg-white px-5 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <Link href={`/team/${member.slug}`} className="group inline-block">
                          <h3 className="text-gray-900 font-semibold text-xl md:text-xl leading-tight group-hover:underline">
                            {member.name[lang]}
                          </h3>
                        </Link>
                        <p className="text-gray-500 text-sm mt-1">{member.role[lang]}</p>
                      </div>
                      <Link
                        href={`/team/${member.slug}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#1e1a61] text-[#1e1a61] transition-colors hover:bg-[#1e1a61] hover:text-white flex-shrink-0"
                        aria-label={member.name[lang]}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M7 17L17 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9 7H17V15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA merged into Footer */}
      <Footer />
    </div>
  )
}
