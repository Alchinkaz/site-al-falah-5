"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Plus } from "lucide-react"
import type { Lang } from "@/lib/i18n"
import { NewsManagement } from "@/components/admin/news-management"

export default function AdminPortfolioPage() {
  const [currentLang, setCurrentLang] = useState<Lang>("en")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [titleTranslations, setTitleTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })
  const [subtitleTranslations, setSubtitleTranslations] = useState({
    en: "",
    ru: "",
    kz: "",
  })

  // Track editor open/close to show top Cancel only during editing
  useEffect(() => {
    const handler = (e: any) => setIsEditing(!!e?.detail?.editing)
    window.addEventListener("admin-editing-project", handler as EventListener)
    return () => window.removeEventListener("admin-editing-project", handler as EventListener)
  }, [])

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        console.log(" Loading portfolio translations...")
        setIsLoading(true)

        const res = await fetch("/api/admin/translations/get")
        if (res.ok) {
          const data = await res.json()
          const translations = data.translations || data
          console.log(" Loaded portfolio translations:", translations.portfolioI18n)

          if (translations.portfolioI18n?.heroTitle) {
            setTitleTranslations(translations.portfolioI18n.heroTitle)
          } else {
            setTitleTranslations({
              en: "Our Portfolio",
              ru: "Наше портфолио",
              kz: "Біздің портфолио",
            })
          }

          if (translations.portfolioI18n?.heroSubtitle) {
            setSubtitleTranslations(translations.portfolioI18n.heroSubtitle)
          } else {
            setSubtitleTranslations({
              en: "Discover our portfolio of innovative companies transforming industries across Central Asia",
              ru: "Ознакомьтесь с портфелем инновационных компаний, меняющих отрасли в Центральной Азии",
              kz: "Орталық Азиядағы салаларды өзгертетін инновациялық компаниялар портфоліосымен танысыңыз",
            })
          }
        }
      } catch (error) {
        console.error(" Error loading portfolio translations:", error)
        // Set defaults on error
        setTitleTranslations({
          en: "Our Portfolio",
          ru: "Наше портфолио",
          kz: "Біздің портфолио",
        })
        setSubtitleTranslations({
          en: "Discover our portfolio of innovative companies transforming industries across Central Asia",
          ru: "Ознакомьтесь с портфелем инновационных компаний, меняющих отрасли в Центральной Азии",
          kz: "Орталық Азиядағы салаларды өзгертетін инновациялық компаниялар портфоліосымен танысыңыз",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTranslations()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage("")
    try {
      const portfolioOnlyUpdates = {
        portfolioI18n: {
          heroTitle: {
            en: titleTranslations.en,
            ru: titleTranslations.ru,
            kz: titleTranslations.kz,
          },
          heroSubtitle: {
            en: subtitleTranslations.en,
            ru: subtitleTranslations.ru,
            kz: subtitleTranslations.kz,
          },
        },
      }

      // Persist ONLY portfolio translations to Supabase
      const translationsSave = await fetch("/api/admin/translations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: portfolioOnlyUpdates }),
      })

      if (!translationsSave.ok) {
        const err = await translationsSave.json().catch(() => ({}))
        throw new Error(err?.error || "Failed to save portfolio translations")
      }

      // Update localStorage with only portfolio data
      const existingI18n = JSON.parse(localStorage.getItem("i18n-translations") || "{}")
      const updatedI18n = {
        ...existingI18n,
        portfolioI18n: portfolioOnlyUpdates.portfolioI18n,
      }
      localStorage.setItem("i18n-translations", JSON.stringify(updatedI18n))

      window.dispatchEvent(new CustomEvent("i18n-updated", { detail: { translations: updatedI18n } }))

      setSaveMessage("Сохранено")
      setTimeout(() => setSaveMessage(""), 2000)
    } catch (e) {
      console.error(" Portfolio save error:", e)
      setSaveMessage("Ошибка при сохранении")
      setTimeout(() => setSaveMessage(""), 2000)
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
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
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Проекты портфолио</h1>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing && (
            <Button
              onClick={() => window.dispatchEvent(new Event("admin-add-project"))}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить проект
            </Button>
          )}
          <div className="flex gap-2">
            <Button
              variant={currentLang === "en" ? "default" : "outline"}
              onClick={() => {
                setCurrentLang("en")
                try {
                  window.dispatchEvent(new CustomEvent("admin-set-project-lang", { detail: { lang: "en" } }))
                } catch {}
              }}
              className={currentLang === "en" ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700"}
            >
              English
            </Button>
            <Button
              variant={currentLang === "ru" ? "default" : "outline"}
              onClick={() => {
                setCurrentLang("ru")
                try {
                  window.dispatchEvent(new CustomEvent("admin-set-project-lang", { detail: { lang: "ru" } }))
                } catch {}
              }}
              className={currentLang === "ru" ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700"}
            >
              Русский
            </Button>
            <Button
              variant={currentLang === "kz" ? "default" : "outline"}
              onClick={() => {
                setCurrentLang("kz")
                try {
                  window.dispatchEvent(new CustomEvent("admin-set-project-lang", { detail: { lang: "kz" } }))
                } catch {}
              }}
              className={currentLang === "kz" ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700"}
            >
              Қазақша
            </Button>
          </div>
          {isEditing && (
            <Button
              onClick={() => window.dispatchEvent(new Event("admin-cancel-edit"))}
              variant="outline"
              className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            >
              Отмена
            </Button>
          )}
          <Button
            onClick={() => {
              if (isEditing) {
                window.dispatchEvent(new Event("admin-save-project"))
              } else {
                handleSave()
              }
            }}
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
            saveMessage.includes("охран") || saveMessage.includes("Сохранено")
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {saveMessage}
        </div>
      )}

      {/* Portfolio Section */}
      <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">Portfolio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="portfolioTitle" className="text-gray-900 font-medium">
                Заголовок ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
              </Label>
              <Input
                id="portfolioTitle"
                value={titleTranslations[currentLang]}
                onChange={(e) => setTitleTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                placeholder="Our Portfolio"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="portfolioSubtitle" className="text-gray-900 font-medium">
                Подзаголовок ({currentLang === "en" ? "English" : currentLang === "ru" ? "Русский" : "Қазақша"})
              </Label>
              <Textarea
                id="portfolioSubtitle"
                value={subtitleTranslations[currentLang]}
                onChange={(e) => setSubtitleTranslations((prev) => ({ ...prev, [currentLang]: e.target.value }))}
                rows={3}
                placeholder="Discover our portfolio of innovative companies transforming industries across Central Asia"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects management merged here */}
      <NewsManagement currentUser={null as any} formatDate={formatDate} currentLang={currentLang} />
    </div>
  )
}
