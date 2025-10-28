"use client"

import { i18n, readLang } from "@/lib/i18n"
import { useEffect, useState } from "react"

export default function CTASection() {
  const [lang, setLang] = useState(readLang())
  useEffect(() => {
    const handler = (e: any) => setLang(e.detail?.lang || readLang())
    window.addEventListener("language-changed", handler)
    return () => window.removeEventListener("language-changed", handler)
  }, [])

  const [line1, line2] = i18n.ctaTitle[lang]

  return (
    <section className="py-24 font-inter" style={{ backgroundColor: "#1e1a61" }}>
      <div className="max-w-[22rem] sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 text-left">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          {line1}
          <br />
          {line2}
        </h2>
      </div>
    </section>
  )
}
