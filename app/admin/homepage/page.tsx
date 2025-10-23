"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import type { Lang } from "@/lib/i18n"

export default function HomepageAdminPage() {
  const [currentLang, setCurrentLang] = useState<Lang>("en")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const [heroBgUrl, setHeroBgUrl] = useState("")
  const [footerBgUrl, setFooterBgUrl] = useState("")
  const [mobileMenuBgUrl, setMobileMenuBgUrl] = useState("")
  const [footerEmail, setFooterEmail] = useState("")
  const [footerCopyright, setFooterCopyright] = useState("")
  const [aboutImageUrl, setAboutImageUrl] = useState("")

  const [heroTranslations, setHeroTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [buttonTranslations, setButtonTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [homePortfolioTitleTranslations, setHomePortfolioTitleTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [homePortfolioSubtitleTranslations, setHomePortfolioSubtitleTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [portfolioButtonTranslations, setPortfolioButtonTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [aboutTitleTranslations, setAboutTitleTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [aboutParagraphsTranslations, setAboutParagraphsTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [mobileMenuTranslations, setMobileMenuTranslations] = useState({
    home: { en: "", ru: "", kz: "" },
    about: { en: "", ru: "", kz: "" },
    portfolio: { en: "", ru: "", kz: "" },
  })
  const [statTitles, setStatTitles] = useState<{ stat1Title: string; stat2Title: string; stat3Title: string }>({
    stat1Title: "",
    stat2Title: "",
    stat3Title: "",
  })
  const [stat1SubtitleTranslations, setStat1SubtitleTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [stat2SubtitleTranslations, setStat2SubtitleTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [stat3SubtitleTranslations, setStat3SubtitleTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [footerContactUsTranslations, setFooterContactUsTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [footerNameTranslations, setFooterNameTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [footerRoleTranslations, setFooterRoleTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [ctaLine1Translations, setCtaLine1Translations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [ctaLine2Translations, setCtaLine2Translations] = useState({
    en: "",
    ru: "",
    kz: "",
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log(" Loading homepage data...")
        setIsLoading(true)

        const res = await fetch("/api/admin/config")
        if (!res.ok) throw new Error("Failed to load config")

        const config = await res.json()
        console.log(" Loaded config:", config)

        if (config.hero?.image) setHeroBgUrl(config.hero.image)
        if (config.mobile_menu_bg?.image) setMobileMenuBgUrl(config.mobile_menu_bg.image)
        if (config.footer_bg?.image) setFooterBgUrl(config.footer_bg.image)
        if (config.footer?.email) setFooterEmail(config.footer.email)
        if (config.footer?.copyright) setFooterCopyright(config.footer.copyright)
        if (config.about?.image) setAboutImageUrl(config.about.image)
        if (config.statistics?.stat1?.title) setStatTitles((p) => ({ ...p, stat1Title: config.statistics.stat1.title }))
        if (config.statistics?.stat2?.title) setStatTitles((p) => ({ ...p, stat2Title: config.statistics.stat2.title }))
        if (config.statistics?.stat3?.title) setStatTitles((p) => ({ ...p, stat3Title: config.statistics.stat3.title }))

        const translationsRes = await fetch("/api/admin/translations/get")
        if (translationsRes.ok) {
          const data = await translationsRes.json()
          const translations = data.translations || data
          console.log(" Loaded translations:", translations)

          if (translations.heroTitle) setHeroTranslations(translations.heroTitle)
          if (translations.heroButton) setButtonTranslations(translations.heroButton)
          if (translations.homePortfolioTitle) setHomePortfolioTitleTranslations(translations.homePortfolioTitle)
          if (translations.homePortfolioSubtitle)
            setHomePortfolioSubtitleTranslations(translations.homePortfolioSubtitle)
          if (translations.portfolioViewAll) setPortfolioButtonTranslations(translations.portfolioViewAll)
          if (translations.aboutTitle) setAboutTitleTranslations(translations.aboutTitle)
          if (translations.aboutParagraphs) {
            setAboutParagraphsTranslations({
              en: (translations.aboutParagraphs.en || []).join("\n\n"),
              ru: (translations.aboutParagraphs.ru || []).join("\n\n"),
              kz: (translations.aboutParagraphs.kz || []).join("\n\n"),
            })
          }
          if (translations.navHome) setMobileMenuTranslations((p) => ({ ...p, home: translations.navHome }))
          if (translations.navAbout) setMobileMenuTranslations((p) => ({ ...p, about: translations.navAbout }))
          if (translations.navPortfolio)
            setMobileMenuTranslations((p) => ({ ...p, portfolio: translations.navPortfolio }))
          if (translations.stat1Subtitle) setStat1SubtitleTranslations(translations.stat1Subtitle)
          if (translations.stat2Subtitle) setStat2SubtitleTranslations(translations.stat2Subtitle)
          if (translations.stat3Subtitle) setStat3SubtitleTranslations(translations.stat3Subtitle)
          if (translations.footerContactUs) setFooterContactUsTranslations(translations.footerContactUs)
          if (translations.footerNameAltay) setFooterNameTranslations(translations.footerNameAltay)
          if (translations.footerRoleAltay) setFooterRoleTranslations(translations.footerRoleAltay)
          if (translations.ctaTitle) {
            setCtaLine1Translations({
              en: translations.ctaTitle.en?.[0] || "",
              ru: translations.ctaTitle.ru?.[0] || "",
              kz: translations.ctaTitle.kz?.[0] || "",
            })
            setCtaLine2Translations({
              en: translations.ctaTitle.en?.[1] || "",
              ru: translations.ctaTitle.ru?.[1] || "",
              kz: translations.ctaTitle.kz?.[1] || "",
            })
          }
        }
      } catch (error) {
        console.error(" Error loading homepage data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      console.log(" Saving homepage data...")

      const normalizeUrl = (val: string) => {
        const v = (val || "").trim()
        if (!v) return ""
        if (/^https?:\/\//i.test(v)) return v
        if (/^data:image\//i.test(v)) return v
        return v.startsWith("/") ? v : `/${v}`
      }

      const configUpdates: Record<string, any> = {}

      if (heroBgUrl) {
        configUpdates.hero = { image: normalizeUrl(heroBgUrl) }
      }
      if (mobileMenuBgUrl) {
        configUpdates.mobile_menu_bg = { image: normalizeUrl(mobileMenuBgUrl) }
      }
      if (footerBgUrl) {
        configUpdates.footer_bg = { image: normalizeUrl(footerBgUrl) }
      }
      if (footerEmail || footerCopyright) {
        configUpdates.footer = {
          email: footerEmail || "",
          copyright: footerCopyright || "",
        }
      }
      if (aboutImageUrl) {
        configUpdates.about = { image: normalizeUrl(aboutImageUrl) }
      }
      if (statTitles.stat1Title || statTitles.stat2Title || statTitles.stat3Title) {
        configUpdates.statistics = {
          stat1: { title: statTitles.stat1Title || "" },
          stat2: { title: statTitles.stat2Title || "" },
          stat3: { title: statTitles.stat3Title || "" },
        }
      }

      if (Object.keys(configUpdates).length > 0) {
        const configRes = await fetch("/api/admin/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(configUpdates),
        })

        if (!configRes.ok) {
          const err = await configRes.json().catch(() => ({}))
          throw new Error(err?.error || "Failed to save config")
        }
      }

      const updatedI18n = {
        navHome: mobileMenuTranslations.home,
        navAbout: mobileMenuTranslations.about,
        navPortfolio: mobileMenuTranslations.portfolio,
        heroTitle: heroTranslations,
        heroButton: buttonTranslations,
        homePortfolioTitle: homePortfolioTitleTranslations,
        homePortfolioSubtitle: homePortfolioSubtitleTranslations,
        portfolioViewAll: portfolioButtonTranslations,
        aboutTitle: aboutTitleTranslations,
        aboutParagraphs: {
          en: aboutParagraphsTranslations.en
            .split(/\n\n+/)
            .map((s) => s.trim())
            .filter(Boolean),
          ru: aboutParagraphsTranslations.ru
            .split(/\n\n+/)
            .map((s) => s.trim())
            .filter(Boolean),
          kz: aboutParagraphsTranslations.kz
            .split(/\n\n+/)
            .map((s) => s.trim())
            .filter(Boolean),
        },
        stat1Subtitle: stat1SubtitleTranslations,
        stat2Subtitle: stat2SubtitleTranslations,
        stat3Subtitle: stat3SubtitleTranslations,
        footerContactUs: footerContactUsTranslations,
        footerNameAltay: footerNameTranslations,
        footerRoleAltay: footerRoleTranslations,
        ctaTitle: {
          en: [ctaLine1Translations.en, ctaLine2Translations.en],
          ru: [ctaLine1Translations.ru, ctaLine2Translations.ru],
          kz: [ctaLine1Translations.kz, ctaLine2Translations.kz],
        },
      }

      const translationsRes = await fetch("/api/admin/translations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: updatedI18n }),
      })

      if (!translationsRes.ok) {
        const err = await translationsRes.json().catch(() => ({}))
        throw new Error(err?.error || "Failed to save translations")
      }

      console.log(" Homepage data saved successfully")
      setSaveMessage("Данные успешно сохранены!")
      setTimeout(() => setSaveMessage(""), 3000)

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("homepage-data-updated"))
        window.dispatchEvent(new CustomEvent("i18n-updated"))
      }
    } catch (error) {
      console.error(" Error saving homepage data:", error)
      setSaveMessage(`Ошибка: ${error instanceof Error ? error.message : "Unknown error"}`)
      setTimeout(() => setSaveMessage(""), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Редактирование главной страницы</h1>
          <p className="text-gray-600 mt-2">Управление контентом hero секции</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <Button
              variant={currentLang === "en" ? "default" : "outline"}
              onClick={() => setCurrentLang("en")}
              className={currentLang === "en" ? "bg-blue-600 text-white" : ""}
            >
              English
            </Button>
            <Button
              variant={currentLang === "ru" ? "default" : "outline"}
              onClick={() => setCurrentLang("ru")}
              className={currentLang === "ru" ? "bg-blue-600 text-white" : ""}
            >
              Русский
            </Button>
            <Button
              variant={currentLang === "kz" ? "default" : "outline"}
              onClick={() => setCurrentLang("kz")}
              className={currentLang === "kz" ? "bg-blue-600 text-white" : ""}
            >
              Қазақша
            </Button>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            style={{ backgroundColor: "#16a34a" }}
            className="hover:opacity-90 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </div>

      {saveMessage && (
        <div
          className={`p-4 rounded-lg ${
            saveMessage.includes("успешно")
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {saveMessage}
        </div>
      )}

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">Navbar Mobile Menu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-gray-900 font-medium">
                Home ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
              </Label>
              <Input
                value={mobileMenuTranslations.home[currentLang]}
                onChange={(e) =>
                  setMobileMenuTranslations((prev) => ({
                    ...prev,
                    home: { ...prev.home, [currentLang]: e.target.value },
                  }))
                }
                placeholder="Home"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label className="text-gray-900 font-medium">
                About Us ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
              </Label>
              <Input
                value={mobileMenuTranslations.about[currentLang]}
                onChange={(e) =>
                  setMobileMenuTranslations((prev) => ({
                    ...prev,
                    about: { ...prev.about, [currentLang]: e.target.value },
                  }))
                }
                placeholder="About Us"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label className="text-gray-900 font-medium">
                Portfolio ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
              </Label>
              <Input
                value={mobileMenuTranslations.portfolio[currentLang]}
                onChange={(e) =>
                  setMobileMenuTranslations((prev) => ({
                    ...prev,
                    portfolio: { ...prev.portfolio, [currentLang]: e.target.value },
                  }))
                }
                placeholder="Portfolio"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-900 font-medium">Фон мобильного меню (ссылка на изображение)</Label>
            <Input
              value={mobileMenuBgUrl}
              onChange={(e) => setMobileMenuBgUrl(e.target.value)}
              placeholder="/placeholder.svg"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">Hero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="heroTitle" className="text-gray-900 font-medium">
                Заголовок ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
              </Label>
              <Textarea
                id="heroTitle"
                value={heroTranslations[currentLang]}
                onChange={(e) => setHeroTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                placeholder="Введите заголовок hero секции"
                rows={3}
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="heroButtonText" className="text-gray-900 font-medium">
                Текст кнопки ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
              </Label>
              <Input
                id="heroButtonText"
                value={buttonTranslations[currentLang]}
                onChange={(e) => setButtonTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                placeholder="View Portfolio"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="heroBg" className="text-gray-900 font-medium">
              Фон Hero (ссылка на изображение)
            </Label>
            <Input
              id="heroBg"
              value={heroBgUrl}
              onChange={(e) => setHeroBgUrl(e.target.value)}
              placeholder="/money-bills-background.jpg"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">Portfolio Section on Homepage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="portfolioTitle" className="text-gray-900 font-medium">
                Заголовок ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
              </Label>
              <Input
                id="portfolioTitle"
                value={homePortfolioTitleTranslations[currentLang]}
                onChange={(e) =>
                  setHomePortfolioTitleTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))
                }
                placeholder="Portfolio"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="portfolioSubtitle" className="text-gray-900 font-medium">
                Подзаголовок ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
              </Label>
              <Textarea
                id="portfolioSubtitle"
                value={homePortfolioSubtitleTranslations[currentLang]}
                onChange={(e) =>
                  setHomePortfolioSubtitleTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))
                }
                placeholder="Successful investments"
                rows={3}
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="portfolioViewAll" className="text-gray-900 font-medium">
                Текст кнопки ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
              </Label>
              <Input
                id="portfolioViewAll"
                value={portfolioButtonTranslations[currentLang]}
                onChange={(e) => setPortfolioButtonTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                placeholder="View All"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">About Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="aboutTitle" className="text-gray-900 font-medium">
                Заголовок ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
              </Label>
              <Input
                id="aboutTitle"
                value={aboutTitleTranslations[currentLang]}
                onChange={(e) => setAboutTitleTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                placeholder="About Us"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="aboutParagraphs" className="text-gray-900 font-medium">
                Текст ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
              </Label>
              <Textarea
                id="aboutParagraphs"
                value={aboutParagraphsTranslations[currentLang]}
                onChange={(e) => setAboutParagraphsTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                placeholder="We invest across energy..."
                rows={6}
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Разделяйте абзацы пустой строкой.</p>
            </div>
            <div>
              <Label htmlFor="aboutImage" className="text-gray-900 font-medium">
                Ссылка на изображение About Us
              </Label>
              <Input
                id="aboutImage"
                value={aboutImageUrl}
                onChange={(e) => setAboutImageUrl(e.target.value)}
                placeholder="https://example.com/about.jpg"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="stat1Title" className="text-gray-900 font-medium">
                  Значение Stat 1
                </Label>
                <Input
                  id="stat1Title"
                  value={statTitles.stat1Title}
                  onChange={(e) => setStatTitles((prev) => ({ ...prev, stat1Title: e.target.value }))}
                  placeholder="$200M+"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-900 font-medium">
                  Подпись Stat 1 ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
                </Label>
                <Input
                  value={stat1SubtitleTranslations[currentLang]}
                  onChange={(e) => setStat1SubtitleTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                  placeholder="Assets Under Management"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="stat2Title" className="text-gray-900 font-medium">
                  Значение Stat 2
                </Label>
                <Input
                  id="stat2Title"
                  value={statTitles.stat2Title}
                  onChange={(e) => setStatTitles((prev) => ({ ...prev, stat2Title: e.target.value }))}
                  placeholder="35+"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-900 font-medium">
                  Подпись Stat 2 ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
                </Label>
                <Input
                  value={stat2SubtitleTranslations[currentLang]}
                  onChange={(e) => setStat2SubtitleTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                  placeholder="Portfolio Companies"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="stat3Title" className="text-gray-900 font-medium">
                  Значение Stat 3
                </Label>
                <Input
                  id="stat3Title"
                  value={statTitles.stat3Title}
                  onChange={(e) => setStatTitles((prev) => ({ ...prev, stat3Title: e.target.value }))}
                  placeholder="10+"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-900 font-medium">
                  Подпись Stat 3 ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
                </Label>
                <Input
                  value={stat3SubtitleTranslations[currentLang]}
                  onChange={(e) => setStat3SubtitleTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                  placeholder="Successful Exits"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">Footer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div>
              <Label className="text-gray-900 font-medium">Фон Footer (ссылка на изображение)</Label>
              <Input
                value={footerBgUrl}
                onChange={(e) => setFooterBgUrl(e.target.value)}
                placeholder="/placeholder.svg"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label className="text-gray-900 font-medium">
                CTA — строка 1 ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
              </Label>
              <Input
                value={ctaLine1Translations[currentLang]}
                onChange={(e) => setCtaLine1Translations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                placeholder="What future are you building?"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label className="text-gray-900 font-medium">
                CTA — строка 2 ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
              </Label>
              <Input
                value={ctaLine2Translations[currentLang]}
                onChange={(e) => setCtaLine2Translations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                placeholder="We'd love to connect."
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-900 font-medium">
                  Метка контактов ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
                </Label>
                <Input
                  value={footerContactUsTranslations[currentLang]}
                  onChange={(e) =>
                    setFooterContactUsTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))
                  }
                  placeholder="Contact us:"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-900 font-medium">Email</Label>
                <Input
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  placeholder="altay@falahpartners.com"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-900 font-medium">
                  Имя ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
                </Label>
                <Input
                  value={footerNameTranslations[currentLang]}
                  onChange={(e) => setFooterNameTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                  placeholder="Altay Mamanbayev"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-900 font-medium">
                  Должность ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
                </Label>
                <Input
                  value={footerRoleTranslations[currentLang]}
                  onChange={(e) => setFooterRoleTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                  placeholder="Chief Operating Officer"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-900 font-medium">Copyright</Label>
              <Input
                value={footerCopyright}
                onChange={(e) => setFooterCopyright(e.target.value)}
                placeholder="© 2025 Al Falah Capital Partners"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
