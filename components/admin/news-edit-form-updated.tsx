"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

// Local type (project/news editor)
export type NewsArticle = {
  id: string
  title: string
  description?: string
  content?: string
  image?: string
  contentImage?: string
  images?: string[]
  badges?: Array<{ label: string; color: string }>
  investmentYear?: number
  contentSections?: Array<{ title: string; text: string }>
  published: boolean
  show_on_homepage?: boolean
  createdAt: string
  updatedAt?: string
}

interface NewsEditFormProps {
  article: NewsArticle
  onSave: (article: NewsArticle) => void
  onCancel: () => void
  hideHeader?: boolean
}

export function NewsEditForm({ article, onSave, onCancel, hideHeader }: NewsEditFormProps) {
  const router = useRouter()
  const [activeLang, setActiveLang] = useState<"en" | "ru" | "kz">("en")
  const [translationsLoaded, setTranslationsLoaded] = useState(false)

  const fieldLabels = {
    en: {
      projectTitle: "Project Title",
      projectImages: "Project Images",
      mainImage: "Main Image (for card)",
      mainImageDesc: "This image is displayed in the project list",
      contentImage: "Content Image",
      contentImageDesc: "Large image at the beginning of the article",
      basicInfo: "Basic Information",
      investmentYear: "Investment Year",
      publicationDate: "Publication Date",
      projectBadges: "Project Badges",
      addBadge: "Add Badge",
      badgeName: "Badge Name",
      projectContent: "Project Content",
      addSection: "Add Section",
      section: "Section",
      sectionTitle: "Title",
      textDescription: "Text Description",
      publicationSettings: "Publication Settings",
      publishProject: "Publish Project",
      showOnHomepage: "Show on Homepage",
      cancel: "Cancel",
      saveChanges: "Save Changes",
      createProject: "Create Project",
    },
    ru: {
      projectTitle: "Заголовок проекта",
      projectImages: "Изображения проекта",
      mainImage: "Основное изображение (для карточки)",
      mainImageDesc: "Это изображение отображается в списке проектов",
      contentImage: "Изображение контента",
      contentImageDesc: "Большое изображение в начале статьи",
      basicInfo: "Основная информация",
      investmentYear: "Год инвестирования",
      publicationDate: "Дата публикации",
      projectBadges: "Бейджи проекта",
      addBadge: "Добавить бейдж",
      badgeName: "Название бейджа",
      projectContent: "Содержание проекта",
      addSection: "Добавить секцию",
      section: "Секция",
      sectionTitle: "Заголовок",
      textDescription: "Текстовое описание",
      publicationSettings: "Настройки публикации",
      publishProject: "Опубликовать проект",
      showOnHomepage: "Показать на главной",
      cancel: "Отмена",
      saveChanges: "Сохранить изменения",
      createProject: "Создать проект",
    },
    kz: {
      projectTitle: "Жоба тақырыбы",
      projectImages: "Жоба суреттері",
      mainImage: "Негізгі сурет (карта үшін)",
      mainImageDesc: "Бұл сурет жобалар тізімінде көрсетіледі",
      contentImage: "Мазмұн суреті",
      contentImageDesc: "Мақаланың басындағы үлкен сурет",
      basicInfo: "Негізгі ақпарат",
      investmentYear: "Инвестиция жылы",
      publicationDate: "Жариялау күні",
      projectBadges: "Жоба белгілері",
      addBadge: "Белгі қосу",
      badgeName: "Белгі атауы",
      projectContent: "Жоба мазмұны",
      addSection: "Бөлім қосу",
      section: "Бөлім",
      sectionTitle: "Тақырып",
      textDescription: "Мәтіндік сипаттама",
      publicationSettings: "Жариялау параметрлері",
      publishProject: "Жобаны жариялау",
      showOnHomepage: "Басты бетте көрсету",
      cancel: "Болдырмау",
      saveChanges: "Өзгерістерді сақтау",
      createProject: "Жоба жасау",
    },
  }

  const t = fieldLabels[activeLang]

  const [localData, setLocalData] = useState(() => {
    console.log("=== NewsEditForm: Initial article data ===")
    console.log("Article:", article)

    const initialData = {
      ...article,
      contentSections: article.contentSections || [{ title: "", text: "" }],
      // Ensure required fields
      title: article.title || "",
      description: article.description || "",
      content: article.content || "",
      image: article.image || "",
      contentImage: article.contentImage || "",
      images: article.images || [],
      badges: (article as any).badges || [],
      investmentYear: (article as any).investmentYear || new Date().getFullYear(),
      published: article.published || false,
      show_on_homepage: article.show_on_homepage || false,
    }

    console.log("Initial localData:", initialData)
    return initialData
  })

  const [titleI18n, setTitleI18n] = useState<{ en: string; ru: string; kz: string }>({
    en: "",
    ru: "",
    kz: "",
  })

  const [badgesI18n, setBadgesI18n] = useState<Array<{ en: string; ru: string; kz: string }>>([])

  const [sectionsI18n, setSectionsI18n] = useState<{
    en: Array<{ title: string; text: string }>
    ru: Array<{ title: string; text: string }>
    kz: Array<{ title: string; text: string }>
  }>({
    en: [{ title: "", text: "" }],
    ru: [{ title: "", text: "" }],
    kz: [{ title: "", text: "" }],
  })

  useEffect(() => {
    const loadTranslations = async () => {
      if (!article.id) {
        // New article - use English title as fallback
        setTitleI18n({
          en: article.title || "",
          ru: "",
          kz: "",
        })
        // Initialize badges from article
        const initialBadges = ((article as any).badges || []).map(() => ({ en: "", ru: "", kz: "" }))
        setBadgesI18n(initialBadges)
        // Initialize sections
        const sectionCount = (article.contentSections || [{ title: "", text: "" }]).length
        setSectionsI18n({
          en: Array(sectionCount)
            .fill(null)
            .map(() => ({ title: "", text: "" })),
          ru: Array(sectionCount)
            .fill(null)
            .map(() => ({ title: "", text: "" })),
          kz: Array(sectionCount)
            .fill(null)
            .map(() => ({ title: "", text: "" })),
        })
        setTranslationsLoaded(true)
        return
      }

      try {
        console.log(" Loading project translations for:", article.id)
        const response = await fetch(`/api/admin/translations/project?id=${article.id}`)
        if (!response.ok) {
          throw new Error("Failed to load translations")
        }

        const data = await response.json()
        console.log(" Loaded project translations:", data)

        // Load title translations
        if (data.title) {
          setTitleI18n({
            en: data.title.en || article.title || "",
            ru: data.title.ru || "",
            kz: data.title.kz || "",
          })
        } else {
          setTitleI18n({
            en: article.title || "",
            ru: "",
            kz: "",
          })
        }

        // Load badge translations
        if (data.badges && Array.isArray(data.badges)) {
          setBadgesI18n(data.badges)
        } else {
          // Initialize empty translations for each badge
          const initialBadges = ((article as any).badges || []).map(() => ({ en: "", ru: "", kz: "" }))
          setBadgesI18n(initialBadges)
        }

        // Load section translations
        if (data.sections) {
          setSectionsI18n({
            en: data.sections.en || [{ title: "", text: "" }],
            ru: data.sections.ru || [{ title: "", text: "" }],
            kz: data.sections.kz || [{ title: "", text: "" }],
          })
        } else {
          // Initialize empty sections
          const sectionCount = (article.contentSections || [{ title: "", text: "" }]).length
          setSectionsI18n({
            en: Array(sectionCount)
              .fill(null)
              .map(() => ({ title: "", text: "" })),
            ru: Array(sectionCount)
              .fill(null)
              .map(() => ({ title: "", text: "" })),
            kz: Array(sectionCount)
              .fill(null)
              .map(() => ({ title: "", text: "" })),
          })
        }

        setTranslationsLoaded(true)
      } catch (error) {
        console.error(" Error loading translations:", error)
        // Fallback to article data
        setTitleI18n({
          en: article.title || "",
          ru: "",
          kz: "",
        })
        const initialBadges = ((article as any).badges || []).map(() => ({ en: "", ru: "", kz: "" }))
        setBadgesI18n(initialBadges)
        const sectionCount = (article.contentSections || [{ title: "", text: "" }]).length
        setSectionsI18n({
          en: Array(sectionCount)
            .fill(null)
            .map(() => ({ title: "", text: "" })),
          ru: Array(sectionCount)
            .fill(null)
            .map(() => ({ title: "", text: "" })),
          kz: Array(sectionCount)
            .fill(null)
            .map(() => ({ title: "", text: "" })),
        })
        setTranslationsLoaded(true)
      }
    }

    loadTranslations()
  }, [article]) // Updated dependency to article

  useEffect(() => {
    const handler = (e: any) => {
      const newLang = e?.detail?.lang
      if (newLang === "en" || newLang === "ru" || newLang === "kz") {
        console.log(" Language switched to:", newLang)
        setActiveLang(newLang)
      }
    }
    window.addEventListener("admin-set-project-lang", handler as EventListener)
    return () => window.removeEventListener("admin-set-project-lang", handler as EventListener)
  }, [])

  // Auth is handled by /admin layout via server routes

  const updateLocalData = (field: string, value: any) => {
    console.log(`=== NewsEditForm: Updating field ${field} ===`)
    console.log("Old value:", (localData as any)[field])
    console.log("New value:", value)

    setLocalData((prev) => {
      const newData = { ...prev, [field]: value }
      console.log("Updated localData:", newData)
      return newData
    })
  }

  const validateData = () => {
    console.log("=== NewsEditForm: Validating data ===")
    console.log("Current localData:", localData)

    const errors: string[] = []

    const hasAnyTitle = titleI18n.en?.trim() || titleI18n.ru?.trim() || titleI18n.kz?.trim()
    if (!hasAnyTitle) {
      errors.push("Заголовок обязателен хотя бы на одном языке")
    }

    console.log("Validation errors:", errors)
    return errors
  }

  const handleSave = async () => {
    console.log("=== NewsEditForm: Saving article ===")
    console.log("Article data to save:", localData)

    // Валидация данных
    const errors = validateData()
    if (errors.length > 0) {
      alert("Ошибки валидации:\n" + errors.join("\n"))
      return
    }

    // Построим базовый массив секций из переводов, чтобы карта секций сохранялась и рендерилась
    const baseSections = (() => {
      const en = sectionsI18n.en || []
      const ru = sectionsI18n.ru || []
      const kz = sectionsI18n.kz || []
      const len = Math.max(en.length, ru.length, kz.length)
      const out: Array<{ title: string; text: string }> = []
      for (let i = 0; i < len; i++) {
        const t = en[i]?.title || ru[i]?.title || kz[i]?.title || ""
        const x = en[i]?.text || ru[i]?.text || kz[i]?.text || ""
        out.push({ title: t, text: x })
      }
      return out
    })()

    const nonEmptySections = baseSections.filter((section) => section.title?.trim() || section.text?.trim())

    const normalizeUrl = (val: string) => {
      const v = (val || "").trim()
      if (!v) return ""
      if (/^https?:\/\//i.test(v)) return v
      if (/^data:image\//i.test(v)) return v
      return v.startsWith("/") ? v : `/${v}`
    }

    const cleanedData = {
      ...localData,
      title: titleI18n.en || localData.title,
      image: normalizeUrl(localData.image as any) || undefined,
      contentImage: normalizeUrl(localData.contentImage as any) || undefined,
      contentSections: nonEmptySections,
      content:
        nonEmptySections.map((section) => `${section.title}\n\n${section.text}`).join("\n\n---\n\n") ||
        localData.content ||
        "",
    }

    console.log("Cleaned data for save:", cleanedData)

    // This ensures the project exists in the database before we try to add translations
    onSave(cleanedData)

    setTimeout(async () => {
      try {
        await fetch("/api/admin/translations/project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: cleanedData.id,
            title: titleI18n,
            badges: badgesI18n,
            sections: sectionsI18n,
          }),
        })
      } catch (err) {
        console.error(" Error saving translations:", err)
      }
    }, 500)
  }

  // Allow parent header Save button to trigger project save as well
  useEffect(() => {
    const handler = () => handleSave()
    window.addEventListener("admin-save-project", handler as EventListener)
    return () => window.removeEventListener("admin-save-project", handler as EventListener)
  }, [localData, titleI18n, sectionsI18n, badgesI18n])

  const addContentSection = () => {
    const newSections = [...localData.contentSections!, { title: "", text: "" }]
    updateLocalData("contentSections", newSections)
    setSectionsI18n((prev) => ({
      en: [...(prev.en || []), { title: "", text: "" }],
      ru: [...(prev.ru || []), { title: "", text: "" }],
      kz: [...(prev.kz || []), { title: "", text: "" }],
    }))
  }

  const removeContentSection = (index: number) => {
    if ((localData.contentSections || []).length > 1) {
      const newSections = (localData.contentSections || []).filter((_, i) => i !== index)
      updateLocalData("contentSections", newSections)
      setSectionsI18n((prev) => ({
        en: (prev.en || []).filter((_, i) => i !== index),
        ru: (prev.ru || []).filter((_, i) => i !== index),
        kz: (prev.kz || []).filter((_, i) => i !== index),
      }))
    }
  }

  const updateContentSection = (index: number, field: "title" | "text", value: string) => {
    setSectionsI18n((prev) => {
      const langArr = [...prev[activeLang]]
      langArr[index] = { ...langArr[index], [field]: value }
      return { ...prev, [activeLang]: langArr }
    })
    // Sync base contentSections for preview alignment
    updateLocalData(
      "contentSections",
      (() => {
        const copy = [...(localData.contentSections || [])]
        while (copy.length <= index) copy.push({ title: "", text: "" })
        copy[index] = { ...copy[index], [field]: value }
        return copy
      })(),
    )
  }

  useEffect(() => {
    console.log("=== NewsEditForm: LocalData changed ===")
    console.log("Current localData:", localData)
  }, [localData])

  if (!translationsLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading translations...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header + language switch */}
      {hideHeader ? null : (
        <div className="flex items-center justify-between">
          <div />
          <div className="flex gap-2 items-center">
            <div className="flex gap-2 mr-2">
              <Button variant={activeLang === "en" ? "default" : "outline"} onClick={() => setActiveLang("en")}>
                English
              </Button>
              <Button variant={activeLang === "ru" ? "default" : "outline"} onClick={() => setActiveLang("ru")}>
                Русский
              </Button>
              <Button variant={activeLang === "kz" ? "default" : "outline"} onClick={() => setActiveLang("kz")}>
                Қазақша
              </Button>
            </div>
            <Button onClick={onCancel} variant="outline">
              {t.cancel}
            </Button>
            <Button onClick={handleSave} style={{ backgroundColor: "#16a34a" }} className="hover:opacity-90 text-white">
              {article.id ? t.saveChanges : t.createProject}
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">{t.projectImages}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Image (для карточки) */}
              <div>
                <Label className="text-sm font-medium mb-2 block text-gray-900">{t.mainImage}</Label>
                <div className="space-y-3">
                  <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {localData.image ? (
                      <img
                        src={(localData as any).image || "/placeholder.svg"}
                        alt="Основное изображение"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <div className="text-center text-gray-500 hidden">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Предварительный просмотр</p>
                    </div>
                  </div>
                  <Input
                    value={(localData as any).image || ""}
                    onChange={(e) => updateLocalData("image", e.target.value)}
                    placeholder="Ссылка на основное изображение для карточки"
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">{t.mainImageDesc}</p>
                </div>
              </div>

              {/* Content Image */}
              <div>
                <Label className="text-sm font-medium mb-2 block text-gray-900">{t.contentImage}</Label>
                <div className="space-y-3">
                  <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {(localData as any).contentImage ? (
                      <img
                        src={(localData as any).contentImage || "/placeholder.svg"}
                        alt="Изображение контента"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <div className="text-center text-gray-500 hidden">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Предварительный просмотр</p>
                    </div>
                  </div>
                  <Input
                    value={(localData as any).contentImage || ""}
                    onChange={(e) => updateLocalData("contentImage", e.target.value)}
                    placeholder="Ссылка на изображение контента"
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">{t.contentImageDesc}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Article Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Основная информация */}
          <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">{t.basicInfo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-gray-900 font-medium">
                  {t.projectTitle} ({activeLang.toUpperCase()}) *
                </Label>
                <Input
                  id="title"
                  value={titleI18n[activeLang] || ""}
                  onChange={(e) => setTitleI18n((prev) => ({ ...prev, [activeLang]: e.target.value }))}
                  placeholder="Введите заголовок проекта"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label className="text-gray-900 font-medium">{t.investmentYear}</Label>
                <Input
                  type="number"
                  value={(localData as any).investmentYear || new Date().getFullYear()}
                  onChange={(e) => updateLocalData("investmentYear", Number(e.target.value))}
                  placeholder="2017"
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label className="text-gray-900 font-medium">{t.publicationDate}</Label>
                <Input
                  type="date"
                  value={((localData as any).createdAt ? new Date((localData as any).createdAt) : new Date())
                    .toISOString()
                    .slice(0, 10)}
                  onChange={(e) => {
                    const v = e.target.value
                    const iso = v ? new Date(v + "T00:00:00.000Z").toISOString() : new Date().toISOString()
                    updateLocalData("createdAt", iso)
                  }}
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Badges manager */}
              <div className="space-y-3">
                <Label className="text-gray-900 font-medium">
                  {t.projectBadges} <span className="ml-2 text-xs text-gray-500">({activeLang.toUpperCase()})</span>
                </Label>
                <div className="space-y-3">
                  {((localData as any).badges || []).map((badge: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={badge.color || "#1e1a61"}
                        onChange={(e) => {
                          const next = [...((localData as any).badges || [])]
                          next[index] = { ...next[index], color: e.target.value }
                          updateLocalData("badges", next)
                        }}
                        className="h-10 w-12 rounded-md border border-gray-300"
                        aria-label="Цвет бейджа"
                      />
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded border border-gray-300 bg-gray-100 text-gray-700">
                          {activeLang.toUpperCase()}
                        </span>
                        <Input
                          value={badgesI18n[index]?.[activeLang] || ""}
                          onChange={(e) => {
                            setBadgesI18n((prev) => {
                              const next = [...prev]
                              next[index] = next[index] || { en: "", ru: "", kz: "" }
                              next[index] = { ...next[index], [activeLang]: e.target.value }
                              return next
                            })
                          }}
                          placeholder={`${t.badgeName} (${activeLang.toUpperCase()})`}
                          className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const next = ((localData as any).badges || []).filter((_: any, i: number) => i !== index)
                          updateLocalData("badges", next)
                          setBadgesI18n((prev) => prev.filter((_, i) => i !== index))
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateLocalData("badges", [...((localData as any).badges || []), { color: "#1e1a61" }])
                      setBadgesI18n((prev) => [...prev, { en: "", ru: "", kz: "" }])
                    }}
                    className="border-gray-300"
                  >
                    <Plus className="h-4 w-4 mr-2" /> {t.addBadge}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Содержание */}
          <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">{t.projectContent} *</CardTitle>
                <Button
                  onClick={addContentSection}
                  size="sm"
                  variant="outline"
                  className="border-gray-300 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addSection}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(localData.contentSections || []).map((section, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        {t.section} {index + 1}
                      </h4>
                      {(localData.contentSections || []).length > 1 && (
                        <Button
                          onClick={() => removeContentSection(index)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-900 font-medium">
                          {t.sectionTitle} ({activeLang.toUpperCase()})
                        </Label>
                        <Input
                          value={sectionsI18n[activeLang]?.[index]?.title || ""}
                          onChange={(e) => updateContentSection(index, "title", e.target.value)}
                          placeholder="Заголовок секции"
                          className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-900 font-medium">
                          {t.textDescription} ({activeLang.toUpperCase()})
                        </Label>
                        <Textarea
                          value={sectionsI18n[activeLang]?.[index]?.text || ""}
                          onChange={(e) => updateContentSection(index, "text", e.target.value)}
                          placeholder="Текст секции"
                          rows={4}
                          className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Настройки публикации */}
          <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">{t.publicationSettings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published" className="text-gray-900 font-medium">
                    {t.publishProject}
                  </Label>
                  <Switch
                    id="published"
                    checked={(localData as any).published || false}
                    onCheckedChange={(checked) => updateLocalData("published", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_on_homepage" className="text-gray-900 font-medium">
                    {t.showOnHomepage}
                  </Label>
                  <Switch
                    id="show_on_homepage"
                    checked={(localData as any).show_on_homepage || false}
                    onCheckedChange={(checked) => updateLocalData("show_on_homepage", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
