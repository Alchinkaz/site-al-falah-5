"use client"

import { i18n, readLang } from "@/lib/i18n"
import { getHomepageData } from "@/lib/homepage-data"
import { useEffect, useState, useMemo } from "react"
import type { HomepageData } from "@/lib/homepage-data"

export default function Footer({ homepageData: initialHomepageData }: { homepageData?: HomepageData | null } = {}) {
  const [lang, setLang] = useState(readLang())
  const [email, setEmail] = useState<string>(initialHomepageData?.footerEmail || "altay@falahpartners.com")
  const [copyright, setCopyright] = useState<string>(
    initialHomepageData?.footerCopyright || "© 2025 Al Falah Capital Partners",
  )
  const [footerBg, setFooterBg] = useState<string>(initialHomepageData?.footerBg || "/hero-bg.jpg")
  const [translations, setTranslations] = useState<any>(null)

  useEffect(() => {
    const handler = (e: any) => setLang(e.detail?.lang || readLang())
    window.addEventListener("language-changed", handler)
    return () => window.removeEventListener("language-changed", handler)
  }, [])

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch("/api/admin/translations/get", { cache: "no-store" })
        if (response.ok) {
          const data = await response.json()
          setTranslations(data.translations)
        }
      } catch (error) {
        console.error("Error loading footer translations:", error)
      }
    }
    loadTranslations()

    const handleI18nUpdate = async () => {
      try {
        const response = await fetch("/api/admin/translations/get", { cache: "no-store" })
        if (response.ok) {
          const data = await response.json()
          setTranslations(data.translations)
        }
      } catch (error) {
        console.error("Error reloading footer translations:", error)
      }
    }

    window.addEventListener("i18n-updated", handleI18nUpdate as EventListener)
    return () => window.removeEventListener("i18n-updated", handleI18nUpdate as EventListener)
  }, [])

  useEffect(() => {
    // If data was provided as prop, don't fetch on mount
    if (initialHomepageData) {
      return
    }

    const loadData = async () => {
      try {
        const data = await getHomepageData(true)
        setEmail(data.footerEmail || "altay@falahpartners.com")
        setCopyright(data.footerCopyright || "© 2025 Al Falah Capital Partners")
        if (data.footerBg) setFooterBg(data.footerBg)
      } catch (error) {
        console.error("Error loading footer data:", error)
      }
    }
    loadData()

    const onData = async (e: any) => {
      try {
        const d = await getHomepageData(true)
        setEmail(d.footerEmail || "altay@falahpartners.com")
        setCopyright(d.footerCopyright || "© 2025 Al Falah Capital Partners")
        if (d.footerBg) setFooterBg(d.footerBg)
      } catch (error) {
        console.error("Error reloading footer data:", error)
      }
    }
    window.addEventListener("homepage-data-updated", onData)
    return () => window.removeEventListener("homepage-data-updated", onData)
  }, [initialHomepageData])

  const t = translations || i18n

  const { ctaLine1, ctaLine2 } = useMemo(() => {
    const ctaTitleData = t.ctaTitle?.[lang] || i18n.ctaTitle?.[lang] || []
    const [line1 = "", line2 = ""] = Array.isArray(ctaTitleData) ? ctaTitleData : []
    return { ctaLine1: line1, ctaLine2: line2 }
  }, [t, lang])

  return (
    <footer
      className="font-inter"
      style={{
        backgroundImage: "url(/hero-bg.jpg)",
        backgroundSize: "1532px",
        backgroundPosition: "center top",
        backgroundRepeat: "repeat",
      }}
    >
      {/* CTA top block kept exactly as before, now inside the footer */}
      <section className="py-24">
        <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 text-left">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {ctaLine1}
            <br />
            {ctaLine2}
          </h2>
        </div>
      </section>

      {/* Original footer content */}
      <div className="py-12">
        <div className="relative max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-8">
            {/* Contact information - left aligned */}
            <div className="flex flex-col gap-1 text-white/80 text-sm">
              <p className="font-medium">{t.footerContactUs?.[lang] || ""}</p>
              <p>{t.footerNameAltay?.[lang] || ""}</p>
              <p>{t.footerRoleAltay?.[lang] || ""}</p>
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                {email}
              </a>
            </div>

            {/* Copyright - centered on desktop, left on mobile */}
            <div className="text-white/80 text-sm text-left md:absolute md:left-1/2 md:-translate-x-1/2">
              <p>{copyright}</p>
              <p>
                <a
                  href="https://wa.me/77710798939"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {t.footerDevelopedBy?.[lang] || ""}
                </a>
              </p>
            </div>
          </div>

          <img
            src="/al-falah-logo-white-img.svg"
            alt="Al Falah Partners"
            className="absolute h-10 w-auto object-contain right-2 sm:right-6 lg:right-8 xl:right-10 2xl:right-12 bottom-0"
          />
        </div>
      </div>
    </footer>
  )
}
