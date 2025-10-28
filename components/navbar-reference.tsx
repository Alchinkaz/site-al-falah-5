"use client"

import type React from "react"

import { useState } from "react"
import { X, Globe } from "lucide-react"
import { resetScrollProgress } from "@/components/scroll-progress"
import { useLanguage } from "@/contexts/LanguageContext"
// Modal lives in the same folder as the navbar, so use a relative import
import ContactModal from "./contact-modal"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    resetScrollProgress()
    window.scrollTo({ top: 0, behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  const handlePhoneClick = () => {
    window.location.href = "tel:+77053333082"
  }

  const handleLanguageChange = (lang: "kz" | "ru") => {
    setLanguage(lang)
    setLanguageDropdownOpen(false)
  }

  const navItems = [
    { href: "#prices", label: t("nav.prices") },
    { href: "#works", label: t("nav.projects") },
    { href: "#reviews", label: t("nav.reviews") },
    { href: "#contacts", label: t("nav.contacts") },
  ]

  return (
    <>
      <header className="fixed top-8 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="relative w-full flex items-center px-4 py-3 sm:px-6 md:py-4 lg:px-6 xl:px-4 xl:py-4 2xl:px-8">
              {/* Logo - Left Side */}
              <div className="flex-shrink-0">
                <a href="#" onClick={handleLogoClick} className="flex items-center">
                  <img
                    src="/images/design-mode/tr-remont-logo.svg"
                    alt="Orda Premium Burabay"
                    className="h-9 md:h-9 lg:h-10 xl:h-10 2xl:h-10 w-auto object-contain"
                    style={{ maxWidth: "200px" }}
                  />
                </a>
              </div>

              {/* Navigation - Left aligned */}
              <nav className="hidden lg:block ml-8">
                <ul className="flex space-x-6 lg:space-x-8 xl:space-x-10">
                  {navItems.map(({ href, label }) => (
                    <li key={href}>
                      <a
                        href={href}
                        className="text-sm lg:text-base font-medium transition-colors hover:text-red-600 whitespace-nowrap font-inter text-gray-900"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Phone Number - Right Side */}
              <div className="ml-auto flex items-center space-x-3 md:space-x-6 flex-shrink-0">
                {/* Phone Number with Online Indicator - Desktop */}
                <div className="hidden md:flex items-center space-x-6">
                  <div className="flex flex-col items-end">
                    <a
                      href="tel:+77053333082"
                      className="text-gray-900 font-semibold text-lg hover:text-red-600 transition-colors"
                    >
                      +7 (705) 333-30-82
                    </a>
                    <div className="flex items-center space-x-2 mt-0">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm lg:text-base font-medium transition-colors hover:text-red-600 whitespace-nowrap font-inter text-gray-500">
                        {t("nav.callUs")}
                      </span>
                    </div>
                  </div>
                  <div className="hidden lg:block relative ml-8 mr-8">
                    <button
                      onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                      className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      aria-label="Выбрать язык"
                    >
                      <Globe className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Выпадающее меню языков */}
                    {languageDropdownOpen && (
                      <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[80px] z-50">
                        <button
                          onClick={() => handleLanguageChange("kz")}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                            language === "kz" ? "text-red-600 font-semibold" : "text-gray-700"
                          }`}
                        >
                          Қаз
                        </button>
                        <button
                          onClick={() => handleLanguageChange("ru")}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                            language === "ru" ? "text-red-600 font-semibold" : "text-gray-700"
                          }`}
                        >
                          Рус
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone Number with Online Indicator - Mobile */}
                <div className="md:hidden flex flex-col items-end">
                  <a
                    href="tel:+77053333082"
                    className="text-gray-900 font-semibold text-base hover:text-red-600 transition-colors"
                  >
                    +7 (705) 333-30-82
                  </a>
                  <div className="flex items-center space-x-2 mt-0">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500">{t("nav.callUs")}</span>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="rounded-lg p-2 text-gray-700 lg:hidden bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Меню"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white">
          <div className="flex flex-col h-full">
            <div className="pt-8">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-lg">
                  <div className="relative w-full flex items-center px-4 py-3 sm:px-6 md:py-4 lg:px-6 xl:px-4 xl:py-4 2xl:px-8">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      <a href="#" onClick={handleLogoClick} className="flex items-center">
                        <img
                          src="/images/design-mode/tr-remont-logo.svg"
                          alt="Orda Premium Burabay"
                          className="h-9 md:h-9 lg:h-10 xl:h-10 2xl:h-10 w-auto object-contain"
                          style={{ maxWidth: "200px" }}
                        />
                      </a>
                    </div>

                    {/* Close button */}
                    <div className="ml-auto flex items-center space-x-3 md:space-x-4 flex-shrink-0">
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
                        aria-label="Закрыть меню"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <nav className="flex-1 pt-8">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <ul className="space-y-0">
                  {navItems.map(({ href, label }, index) => (
                    <li key={href}>
                      <a
                        href={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-4 text-lg font-medium text-black transition-colors hover:text-red-600 font-inter"
                      >
                        {label}
                      </a>
                      {index < navItems.length - 1 && <div className="h-px bg-gray-200"></div>}
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-gray-200 mt-0">
                  <div className="flex items-center justify-center space-x-6">
                    <button
                      onClick={() => setLanguage("kz")}
                      className={`text-lg font-medium transition-colors hover:text-red-600 ${
                        language === "kz" ? "text-red-600 font-semibold" : "text-gray-700"
                      }`}
                    >
                      Қаз
                    </button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <button
                      onClick={() => setLanguage("ru")}
                      className={`text-lg font-medium transition-colors hover:text-red-600 ${
                        language === "ru" ? "text-red-600 font-semibold" : "text-gray-700"
                      }`}
                    >
                      Рус
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </>
  )
}
