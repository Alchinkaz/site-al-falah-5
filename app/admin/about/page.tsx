"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import type { Lang } from "@/lib/i18n"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getAllTeamMembers, type TeamMemberData } from "@/lib/team-data"

export default function AdminAboutPage() {
  const [currentLang, setCurrentLang] = useState<Lang>("en")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const [aboutImageUrl, setAboutImageUrl] = useState("")
  const [statTitles, setStatTitles] = useState<{ stat1Title: string; stat2Title: string; stat3Title: string }>({
    stat1Title: "",
    stat2Title: "",
    stat3Title: "",
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
  const [keyTermsRows, setKeyTermsRows] = useState<any[]>([])
  const [keyTermsTitle, setKeyTermsTitle] = useState<{ en: string; ru: string; kz: string }>({
    en: "",
    ru: "",
    kz: "",
  })
  const [sectorsTitle, setSectorsTitle] = useState<{ en: string; ru: string; kz: string }>({
    en: "",
    ru: "",
    kz: "",
  })
  const [sectors, setSectors] = useState<any[]>([])
  const [teamTitle, setTeamTitle] = useState<{ en: string; ru: string; kz: string }>({
    en: "",
    ru: "",
    kz: "",
  })
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([])
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

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log(" Loading about page data...")
        setIsLoading(true)

        const res = await fetch("/api/admin/config")
        if (!res.ok) throw new Error("Failed to load config")

        const config = await res.json()
        console.log(" Loaded config:", config)

        if (config.about?.image) setAboutImageUrl(config.about.image)
        if (config.statistics?.stat1?.title) setStatTitles((p) => ({ ...p, stat1Title: config.statistics.stat1.title }))
        if (config.statistics?.stat2?.title) setStatTitles((p) => ({ ...p, stat2Title: config.statistics.stat2.title }))
        if (config.statistics?.stat3?.title) setStatTitles((p) => ({ ...p, stat3Title: config.statistics.stat3.title }))

        const translationsRes = await fetch("/api/admin/translations/get")
        if (translationsRes.ok) {
          const data = await translationsRes.json()
          const translations = data.translations || data
          console.log(" Loaded translations:", translations)

          if (translations.aboutPageTitle || translations.aboutTitle) {
            setAboutTitleTranslations(translations.aboutPageTitle || translations.aboutTitle)
          }
          if (translations.aboutPageParagraphs || translations.aboutParagraphs) {
            const paragraphs = translations.aboutPageParagraphs || translations.aboutParagraphs
            setAboutParagraphsTranslations({
              en: (paragraphs.en || []).join("\n\n"),
              ru: (paragraphs.ru || []).join("\n\n"),
              kz: (paragraphs.kz || []).join("\n\n"),
            })
          }
          if (translations.aboutPageKeyTermsRows) {
            const rows = translations.aboutPageKeyTermsRows
            if (Array.isArray(rows)) {
              setKeyTermsRows(rows)
            } else if (rows?.en && Array.isArray(rows.en)) {
              // Fallback when API returns language-object shape
              setKeyTermsRows(rows.en)
            }
          }
          if (translations.aboutPageKeyTermsTitle) setKeyTermsTitle(translations.aboutPageKeyTermsTitle)
          if (translations.aboutPageSectorsTitle) setSectorsTitle(translations.aboutPageSectorsTitle)
          if (translations.aboutPageSectors) {
            const sect = translations.aboutPageSectors
            if (Array.isArray(sect)) {
              setSectors(sect)
            } else if (sect?.en && Array.isArray(sect.en)) {
              // Fallback when API returns language-object shape
              setSectors(sect.en)
            }
          }
          if (translations.teamTitle) setTeamTitle(translations.teamTitle)
          if (translations.stat1Subtitle) setStat1SubtitleTranslations(translations.stat1Subtitle)
          if (translations.stat2Subtitle) setStat2SubtitleTranslations(translations.stat2Subtitle)
          if (translations.stat3Subtitle) setStat3SubtitleTranslations(translations.stat3Subtitle)
        }

        console.log(" Loading team members from team_translations table...")
        const members = await getAllTeamMembers()
        console.log(" Loaded team members:", members)
        setTeamMembers(members)
      } catch (error) {
        console.error(" Error loading about page data:", error)
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
      console.log(" Starting save operation...")

      // Step 1: Save statistics to homepage_config table
      console.log(" Saving statistics:", statTitles)
      const statsPayload = {
        statistics: {
          stat1: { title: statTitles.stat1Title || "" },
          stat2: { title: statTitles.stat2Title || "" },
          stat3: { title: statTitles.stat3Title || "" },
        },
      }

      const statsRes = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statsPayload),
      })

      if (!statsRes.ok) {
        const err = await statsRes.text()
        throw new Error(`Failed to save statistics: ${err}`)
      }
      console.log(" Statistics saved successfully")

      // Step 2: Save about image to homepage_config table
      if (aboutImageUrl) {
        console.log(" Saving about image:", aboutImageUrl)
        const aboutRes = await fetch("/api/admin/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ about: { image: aboutImageUrl } }),
        })

        if (!aboutRes.ok) {
          const err = await statsRes.text()
          throw new Error(`Failed to save about image: ${err}`)
        }
        console.log(" About image saved successfully")
      }

      // Step 3: Save team data to team_translations table
      console.log(" Saving team data...")
      for (const member of teamMembers) {
        const slug = member.slug

        // Save name translations
        for (const lang of ["en", "ru", "kz"] as const) {
          if (member.name[lang]) {
            const nameRes = await fetch("/api/admin/team", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                slug,
                type: "name",
                language: lang,
                value: member.name[lang],
              }),
            })
            if (!nameRes.ok) {
              console.error(` Failed to save name for ${slug} (${lang})`)
            }
          }
        }

        // Save role translations
        for (const lang of ["en", "ru", "kz"] as const) {
          if (member.role[lang]) {
            const roleRes = await fetch("/api/admin/team", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                slug,
                type: "role",
                language: lang,
                value: member.role[lang],
              }),
            })
            if (!roleRes.ok) {
              console.error(` Failed to save role for ${slug} (${lang})`)
            }
          }
        }

        // Save bio_left translations
        for (const lang of ["en", "ru", "kz"] as const) {
          if (member.bioLeft[lang]) {
            const bioLeftRes = await fetch("/api/admin/team", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                slug,
                type: "bio_left",
                language: lang,
                value: member.bioLeft[lang],
              }),
            })
            if (!bioLeftRes.ok) {
              console.error(` Failed to save bio_left for ${slug} (${lang})`)
            }
          }
        }

        // Save bio_right translations
        for (const lang of ["en", "ru", "kz"] as const) {
          if (member.bioRight[lang]) {
            const bioRightRes = await fetch("/api/admin/team", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                slug,
                type: "bio_right",
                language: lang,
                value: member.bioRight[lang],
              }),
            })
            if (!bioRightRes.ok) {
              console.error(` Failed to save bio_right for ${slug} (${lang})`)
            }
          }
        }

        // Save photo to team_members table
        if (member.photo) {
          const photoRes = await fetch("/api/admin/team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug,
              photo: member.photo,
            }),
          })
          if (!photoRes.ok) {
            console.error(` Failed to save photo for ${slug}`)
          }
        }
      }
      console.log(" Team data saved successfully")

      // Step 4: Save other translations to translations table
      console.log(" Saving other translations...")
      const updatedI18n = {
        aboutPageTitle: aboutTitleTranslations,
        aboutPageParagraphs: {
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
        aboutPageKeyTermsRows: keyTermsRows,
        aboutPageKeyTermsTitle: keyTermsTitle,
        aboutPageSectorsTitle: sectorsTitle,
        aboutPageSectors: sectors,
        teamTitle,
        stat1Subtitle: stat1SubtitleTranslations,
        stat2Subtitle: stat2SubtitleTranslations,
        stat3Subtitle: stat3SubtitleTranslations,
      }

      const translationsRes = await fetch("/api/admin/translations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: updatedI18n }),
      })

      if (!translationsRes.ok) {
        const err = await translationsRes.text()
        throw new Error(`Failed to save translations: ${err}`)
      }
      console.log(" Translations saved successfully")

      setSaveMessage("Все данные успешно сохранены в Supabase!")
      setTimeout(() => setSaveMessage(""), 3000)

      // Trigger frontend updates
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("homepage-data-updated"))
        window.dispatchEvent(new CustomEvent("i18n-updated"))
        window.dispatchEvent(new CustomEvent("team-data-updated"))
      }
    } catch (e) {
      console.error(" Error saving about page data:", e)
      setSaveMessage(`ОШИБКА: ${e instanceof Error ? e.message : "Unknown error"}`)
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
          <h1 className="text-3xl font-bold text-gray-900">Редактирование страницы «О компании»</h1>
          <p className="text-gray-600 mt-2">Управление контентом страницы «О компании»</p>
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

      {/* About Us Section Editor */}
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
                rows={12}
                placeholder={
                  "We make investments in companies across energy, mining, agriculture, food production, high‑tech, healthcare and other sectors.\n\nLeveraging deep regional expertise and a strong network, we are raising the Falah Growth Fund II, a USD200 million private equity fund focused on emerging opportunities and long‑term value creation.\n\nAl Falah Capital Partners is headquartered in Almaty. Since 2008, our principals have invested in or acquired dozens of companies including Karaganda Energocenter, Ulmus Besshoky, Alsad Kazakhstan, Ai Karaaul, Karaganda Kus, Elefund VC funds, Robinhood Inc., Soul of Nomad Inc. and others.\n\nCentral Asia is a rapidly growing region with exceptional entrepreneurs. We remain focused on its potential and are ready to partner with new investors to capture the next wave of growth."
                }
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Разделяйте абзацы пустой строкой.</p>
            </div>
            <div>
              <Label htmlFor="aboutImage" className="text-gray-900 font-medium">
                Ссылка на изображение (верхний баннер)
              </Label>
              <Input
                id="aboutImage"
                value={aboutImageUrl}
                onChange={(e) => setAboutImageUrl(e.target.value)}
                placeholder="/placeholder.svg"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Key terms editor */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">Key terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-900 font-medium">Заголовок Key terms ({currentLang.toUpperCase()})</Label>
            <Input
              value={keyTermsTitle[currentLang] || ""}
              onChange={(e) => setKeyTermsTitle({ ...keyTermsTitle, [currentLang]: e.target.value })}
              placeholder={
                currentLang === "en" ? "Key terms" : currentLang === "ru" ? "Ключевые условия" : "Негізгі шарттар"
              }
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {keyTermsRows.map((row, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-gray-900 font-medium">Label ({currentLang.toUpperCase()})</Label>
                  <Input
                    value={(row.label && row.label[currentLang]) || ""}
                    onChange={(e) => {
                      const next = [...keyTermsRows]
                      next[idx] = {
                        ...next[idx],
                        label: { ...(next[idx]?.label || {}), [currentLang]: e.target.value },
                      }
                      setKeyTermsRows(next)
                    }}
                    placeholder={currentLang === "en" ? "Size" : currentLang === "ru" ? "Размер" : "Өлшемі"}
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Value ({currentLang.toUpperCase()})</Label>
                  <Input
                    value={(row.value && row.value[currentLang]) || ""}
                    onChange={(e) => {
                      const next = [...keyTermsRows]
                      next[idx] = {
                        ...next[idx],
                        value: { ...(next[idx]?.value || {}), [currentLang]: e.target.value },
                      }
                      setKeyTermsRows(next)
                    }}
                    placeholder={currentLang === "en" ? "USD200m" : "USD200 млн"}
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                  onClick={() => setKeyTermsRows(keyTermsRows.filter((_, i) => i !== idx))}
                >
                  Удалить
                </Button>
              </div>
            </div>
          ))}
          <div>
            <Button
              variant="outline"
              onClick={() =>
                setKeyTermsRows([
                  ...keyTermsRows,
                  { label: { en: "", ru: "", kz: "" }, value: { en: "", ru: "", kz: "" } },
                ])
              }
              className="border-gray-300"
            >
              Добавить строку
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Sectors editor */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">Sectors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-900 font-medium">Заголовок Sectors ({currentLang.toUpperCase()})</Label>
            <Input
              value={sectorsTitle[currentLang] || ""}
              onChange={(e) => setSectorsTitle({ ...sectorsTitle, [currentLang]: e.target.value })}
              placeholder={currentLang === "en" ? "Sectors" : currentLang === "ru" ? "Сектора" : "Салалар"}
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {sectors.map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-gray-900 font-medium">Title ({currentLang.toUpperCase()})</Label>
                  <Input
                    value={(item.title && item.title[currentLang]) || ""}
                    onChange={(e) => {
                      const next = [...sectors]
                      next[idx] = {
                        ...next[idx],
                        title: { ...(next[idx]?.title || {}), [currentLang]: e.target.value },
                      }
                      setSectors(next)
                    }}
                    placeholder={
                      currentLang === "en" ? "Oil & Gas" : currentLang === "ru" ? "Нефть и газ" : "Мұнай‑газ"
                    }
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Description ({currentLang.toUpperCase()})</Label>
                  <Textarea
                    value={(item.desc && item.desc[currentLang]) || ""}
                    onChange={(e) => {
                      const next = [...sectors]
                      next[idx] = { ...next[idx], desc: { ...(next[idx]?.desc || {}), [currentLang]: e.target.value } }
                      setSectors(next)
                    }}
                    rows={3}
                    placeholder={
                      currentLang === "en"
                        ? "Production, Food processing, Logistics"
                        : currentLang === "ru"
                          ? "Производство, переработка продуктов питания, логистика"
                          : "Өндіріс, азық‑түлік өңдеу, логистика"
                    }
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                  onClick={() => setSectors(sectors.filter((_, i) => i !== idx))}
                >
                  Удалить
                </Button>
              </div>
            </div>
          ))}
          <div>
            <Button
              variant="outline"
              onClick={() =>
                setSectors([...sectors, { title: { en: "", ru: "", kz: "" }, desc: { en: "", ru: "", kz: "" } }])
              }
              className="border-gray-300"
            >
              Добавить сектор
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section Editor (same as homepage) */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="stat1Title" className="text-gray-900 font-medium">
                  Значение
                </Label>
                <Input
                  id="stat1Title"
                  value={statTitles.stat1Title}
                  onChange={(e) => setStatTitles((prev) => ({ ...prev, stat1Title: e.target.value }))}
                  placeholder="$50M+"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-900 font-medium">
                  Подпись ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
                </Label>
                <Input
                  value={stat1SubtitleTranslations[currentLang]}
                  onChange={(e) => setStat1SubtitleTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                  placeholder="Assets Under Management"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Stat 2 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="stat2Title" className="text-gray-900 font-medium">
                  Значение
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
                  Подпись ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
                </Label>
                <Input
                  value={stat2SubtitleTranslations[currentLang]}
                  onChange={(e) => setStat2SubtitleTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                  placeholder="Portfolio Companies"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Stat 3 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="stat3Title" className="text-gray-900 font-medium">
                  Значение
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
                  Подпись ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
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

      {/* Team editor */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">Team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-gray-900 font-medium">Заголовок Team ({currentLang.toUpperCase()})</Label>
            <Input
              value={teamTitle[currentLang] || ""}
              onChange={(e) => setTeamTitle({ ...teamTitle, [currentLang]: e.target.value })}
              placeholder={currentLang === "en" ? "Meet the team" : currentLang === "ru" ? "Команда" : "Команда"}
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((member, idx) => (
              <div key={member.slug} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div>
                  <Label className="text-gray-900 font-medium">Имя ({currentLang.toUpperCase()})</Label>
                  <Input
                    value={member.name[currentLang] || ""}
                    onChange={(e) => {
                      const updated = [...teamMembers]
                      updated[idx] = {
                        ...updated[idx],
                        name: { ...updated[idx].name, [currentLang]: e.target.value },
                      }
                      setTeamMembers(updated)
                    }}
                    placeholder={
                      currentLang === "en" ? "Full name" : currentLang === "ru" ? "Имя и фамилия" : "Аты-жөні"
                    }
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Должность ({currentLang.toUpperCase()})</Label>
                  <Input
                    value={member.role[currentLang] || ""}
                    onChange={(e) => {
                      const updated = [...teamMembers]
                      updated[idx] = {
                        ...updated[idx],
                        role: { ...updated[idx].role, [currentLang]: e.target.value },
                      }
                      setTeamMembers(updated)
                    }}
                    placeholder={currentLang === "en" ? "Role" : currentLang === "ru" ? "Должность" : "Лауазым"}
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Фото (URL)</Label>
                  <Input
                    value={member.photo || ""}
                    onChange={(e) => {
                      const updated = [...teamMembers]
                      updated[idx] = { ...updated[idx], photo: e.target.value }
                      setTeamMembers(updated)
                    }}
                    placeholder="/placeholder.svg"
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Био — абзац 1 ({currentLang.toUpperCase()})</Label>
                  <Textarea
                    value={member.bioLeft[currentLang] || ""}
                    onChange={(e) => {
                      const updated = [...teamMembers]
                      updated[idx] = {
                        ...updated[idx],
                        bioLeft: { ...updated[idx].bioLeft, [currentLang]: e.target.value },
                      }
                      setTeamMembers(updated)
                    }}
                    rows={4}
                    placeholder={
                      currentLang === "en" ? "First paragraph" : currentLang === "ru" ? "Первый абзац" : "Бірінші абзац"
                    }
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Био — абзац 2 ({currentLang.toUpperCase()})</Label>
                  <Textarea
                    value={member.bioRight[currentLang] || ""}
                    onChange={(e) => {
                      const updated = [...teamMembers]
                      updated[idx] = {
                        ...updated[idx],
                        bioRight: { ...updated[idx].bioRight, [currentLang]: e.target.value },
                      }
                      setTeamMembers(updated)
                    }}
                    rows={4}
                    placeholder={
                      currentLang === "en" ? "Second paragraph" : currentLang === "ru" ? "Второй абзац" : "Екінші абзац"
                    }
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
