"use client"
import Link from "next/link"
import { useState, useEffect, useMemo, useCallback } from "react"
import { usePathname } from "next/navigation"
import { X, Globe, Menu } from "lucide-react"
import { getHomepageData } from "@/lib/homepage-data"
import type { HomepageData } from "@/lib/homepage-data"

export default function Navbar({
  forceScrolled = false,
  homepageData: initialHomepageData,
}: { forceScrolled?: boolean; homepageData?: HomepageData | null } = {}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileMenuAnimating, setMobileMenuAnimating] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [language, setLanguage] = useState<"kz" | "ru" | "en">(
    (typeof window !== "undefined" && (localStorage.getItem("lang") as any)) || "en",
  )
  const [isScrolled, setIsScrolled] = useState(false)
  const shouldShowScrolled = forceScrolled || isScrolled
  const shouldShowTransparent = mobileMenuOpen && !forceScrolled
  const [menuBg, setMenuBg] = useState<string>(
    initialHomepageData?.mobileMenuBg || initialHomepageData?.heroImage || "/hero-bg.jpg",
  )
  const [translations, setTranslations] = useState<any>(null)

  // Controls re-entry animation of the transparent navbar on hero after menu closes
  const [transparentPhase, setTransparentPhase] = useState<"idle" | "pre" | "in">("idle")

  // Initialize scrolled state if forceScrolled is true
  useEffect(() => {
    if (forceScrolled) {
      setIsScrolled(true)
    }
  }, [forceScrolled])

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch("/api/admin/translations/get", { cache: "no-store" })
        if (response.ok) {
          const data = await response.json()
          setTranslations(data.translations)
        }
      } catch (error) {
        console.error("Error loading navbar translations:", error)
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
        console.error("Error reloading navbar translations:", error)
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

    const load = async () => {
      try {
        const data = await getHomepageData(true)
        setMenuBg(data?.mobileMenuBg || data?.heroImage || "/hero-bg.jpg")
      } catch {}
    }
    load()

    const handleUpdate = async () => {
      try {
        const fresh = await getHomepageData(true)
        setMenuBg(fresh?.mobileMenuBg || fresh?.heroImage || "/hero-bg.jpg")
      } catch {}
    }
    if (typeof window !== "undefined") {
      window.addEventListener("homepage-data-updated", handleUpdate as EventListener)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("homepage-data-updated", handleUpdate as EventListener)
      }
    }
  }, [initialHomepageData])

  useEffect(() => {
    if (forceScrolled) return // Don't listen to scroll if forced

    let ticking = false
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const heroHeight = window.innerHeight
        const currentScrollY = window.scrollY
        setIsScrolled(currentScrollY >= heroHeight)
      }
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(controlNavbar)
        ticking = true
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll, { passive: true })
      // Call controlNavbar immediately to set the initial state
      controlNavbar()
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [forceScrolled])

  const handleLanguageChange = useCallback((lang: "kz" | "ru" | "en") => {
    setLanguage(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang)
      window.dispatchEvent(new CustomEvent("language-changed", { detail: { lang } }))
    }
    setLanguageDropdownOpen(false)
  }, [])

  // Keep in sync with global language changes dispatched from other components
  useEffect(() => {
    const onLangChanged = (e: any) => {
      const next = e?.detail?.lang
      if (next && next !== language) setLanguage(next)
    }
    if (typeof window !== "undefined") {
      window.addEventListener("language-changed", onLangChanged)
      return () => window.removeEventListener("language-changed", onLangChanged)
    }
  }, [language])

  const handleMobileMenuToggle = useCallback(() => {
    if (!mobileMenuOpen) {
      setMobileMenuOpen(true)
      // Small delay to ensure the element is rendered before animation
      setTimeout(() => {
        setMobileMenuAnimating(true)
      }, 10)
    } else {
      setMobileMenuAnimating(false)
      // Close overlay then prepare transparent header animation if on hero (not scrolled)
      setTimeout(() => {
        setMobileMenuOpen(false)
        if (!forceScrolled && !isScrolled) {
          // phase 1: place header above viewport, invisible
          setTransparentPhase("pre")
          // phase 2: next frame, slide/fade in
          setTimeout(() => setTransparentPhase("in"), 20)
          // cleanup after animation duration
          setTimeout(() => setTransparentPhase("idle"), 520)
        }
      }, 500)
    }
  }, [mobileMenuOpen, forceScrolled, isScrolled])

  const navItems = useMemo(
    () => [
      {
        href: "/",
        label:
          translations?.navHome?.[language] ||
          (language === "ru" ? "Главная" : language === "kz" ? "Басты бет" : "Home"),
      },
      {
        href: "/about",
        label:
          translations?.navAbout?.[language] ||
          (language === "ru" ? "О компании" : language === "kz" ? "Біз туралы" : "About Us"),
      },
      {
        href: "/portfolio",
        label:
          translations?.navPortfolio?.[language] ||
          (language === "ru" ? "Портфолио" : language === "kz" ? "Портфолио" : "Portfolio"),
      },
    ],
    [translations, language],
  )

  return (
    <>
      {/* Transparent header on hero (visible before scroll, or when mobile menu open) */}
      {(mobileMenuOpen || !shouldShowScrolled) && (
        <header
          className={`fixed left-0 right-0 top-0 ${mobileMenuOpen ? "z-[70]" : "z-10"} bg-transparent transition-transform transition-opacity duration-500 ease-in-out 
            ${
              mobileMenuOpen
                ? "translate-y-0 opacity-100"
                : shouldShowScrolled
                  ? "-translate-y-full opacity-0"
                  : transparentPhase === "pre"
                    ? "-translate-y-full opacity-0"
                    : "translate-y-0 opacity-100"
            }
          `}
        >
          <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
            <div
              className={`relative w-full flex items-center justify-between py-3 md:py-4 px-0 ${mobileMenuOpen ? "transition-transform duration-500 ease-in-out " + (mobileMenuAnimating ? "translate-y-0" : "-translate-y-full") : ""}`}
            >
              <Link href="/" className="flex items-center shrink-0">
                <img
                  src="/al-falah-logo-white-img.svg"
                  alt="Al Falah Partners"
                  className="block h-10 md:h-10 lg:h-12 xl:h-12 2xl:h-12 w-auto shrink-0 object-contain"
                />
              </Link>

              <div className="ml-auto flex items-center space-x-3 md:space-x-4 flex-shrink-0">
                <div className={`relative ${mobileMenuOpen ? "block" : "hidden md:block"}`}>
                  <button
                    onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white`}
                    aria-label="Select language"
                  >
                    <Globe className="w-5 h-5" />
                  </button>

                  {languageDropdownOpen && (mobileMenuOpen || !shouldShowScrolled) && (
                    <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[80px] z-50">
                      <button
                        onClick={() => handleLanguageChange("kz")}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                          language === "kz" ? "text-[#1e1a61] font-semibold" : "text-gray-700"
                        }`}
                      >
                        Қаз
                      </button>
                      <button
                        onClick={() => handleLanguageChange("ru")}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                          language === "ru" ? "text-[#1e1a61] font-semibold" : "text-gray-700"
                        }`}
                      >
                        Рус
                      </button>
                      <button
                        onClick={() => handleLanguageChange("en")}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                          language === "en" ? "text-[#1e1a61] font-semibold" : "text-gray-700"
                        }`}
                      >
                        Eng
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleMobileMenuToggle}
                  className={`rounded-lg p-2 transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white`}
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* White header that slides in on scroll and after closing mobile menu */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-transform transition-opacity duration-500 ease-in-out
          ${
            shouldShowScrolled || forceScrolled
              ? mobileMenuOpen
                ? "-translate-y-full opacity-0"
                : "translate-y-0 opacity-100 bg-white border-b border-gray-200"
              : "-translate-y-full opacity-0"
          }
        `}
      >
        <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="relative w-full flex items-center justify-between py-3 md:py-4 px-0">
            <Link href="/" className="flex items-center shrink-0">
              <img
                src="/al-falah-logo-black-img.svg"
                alt="Al Falah Partners"
                className="block h-10 md:h-10 lg:h-12 xl:h-12 2xl:h-12 w-auto shrink-0 object-contain"
              />
            </Link>

            {/* Centered logo text shown only in white navbar state (when not transparent and not mobile menu open) */}
            <div
              className={`${(shouldShowScrolled || forceScrolled) && !mobileMenuOpen ? "block" : "hidden"} absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2`}
            >
              <Link href="/" aria-label="Home">
                {/* Mobile/Tablet: keep existing short text logo */}
                <img
                  src="/al-falah-logo-black-text.svg"
                  alt="Al Falah Partners"
                  className="block md:hidden h-8 w-auto cursor-pointer"
                />
                {/* Desktop: use full black text logo */}
                <img
                  src="/al-falah-logo-black-text-full.svg"
                  alt="Al Falah Partners"
                  className="hidden md:block h-9 lg:h-10 xl:h-11 w-auto cursor-pointer"
                />
              </Link>
            </div>

            <div className="ml-auto flex items-center space-x-3 md:space-x-4 flex-shrink-0">
              <div className="relative hidden md:block">
                <button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                    shouldShowScrolled || forceScrolled
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      : "bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white"
                  }`}
                  aria-label="Select language"
                >
                  <Globe className="w-5 h-5" />
                </button>

                {languageDropdownOpen && shouldShowScrolled && (
                  <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[80px] z-50">
                    <button
                      onClick={() => handleLanguageChange("kz")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                        language === "kz" ? "text-[#1e1a61] font-semibold" : "text-gray-700"
                      }`}
                    >
                      Қаз
                    </button>
                    <button
                      onClick={() => handleLanguageChange("ru")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                        language === "ru" ? "text-[#1e1a61] font-semibold" : "text-gray-700"
                      }`}
                    >
                      Рус
                    </button>
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                        language === "en" ? "text-[#1e1a61] font-semibold" : "text-gray-700"
                      }`}
                    >
                      Eng
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleMobileMenuToggle}
                className={`rounded-lg p-2 transition-colors ${
                  shouldShowScrolled || forceScrolled
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : "bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white"
                }`}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className={`fixed inset-0 z-[60] transition-all duration-500 ease-in-out transform bg-cover bg-center bg-no-repeat ${
            mobileMenuAnimating ? "translate-y-0" : "-translate-y-full"
          }`}
          style={{
            backgroundImage: "url(/hero-bg.jpg)",
            backgroundSize: "1532px",
            backgroundPosition: "center top",
            backgroundRepeat: "repeat",
          }}
        >
          {/* Navigation links - aligned to navbar width, left aligned */}
          <div className="h-full flex items-center">
            <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 w-full">
              <nav className="space-y-8">
                {navItems.map(({ href, label }) => {
                  const isActive = (href === "/" && pathname === "/") || (href !== "/" && pathname.startsWith(href))
                  return (
                    <Link
                      key={href}
                      href={href}
                      prefetch={true}
                      onClick={handleMobileMenuToggle}
                      className={`block text-white text-4xl md:text-5xl font-normal transition-all duration-200 font-inter ${
                        isActive
                          ? "underline decoration-1 underline-offset-4"
                          : "hover:underline decoration-1 underline-offset-4"
                      }`}
                    >
                      {label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
