"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit3, Trash2, FileText } from "lucide-react"
import type { Lang } from "@/lib/i18n"
import { NewsEditForm } from "./news-edit-form-updated"
import { ProjectService } from "@/lib/supabase-services"

interface NewsManagementProps {
  currentUser: any
  formatDate: (dateString: string) => string
  currentLang: Lang // Added currentLang prop from parent
}

type ProjectRow = any

type NewsArticle = {
  id: string
  title: string
  description?: string
  content?: string
  image?: string
  contentImage?: string
  badges?: Array<{ label: string; color: string }>
  investmentYear?: number
  contentSections?: { title?: string; text: string }[]
  published: boolean
  show_on_homepage?: boolean
  createdAt: string
  updatedAt?: string
}

export function NewsManagement({ currentUser, formatDate, currentLang }: NewsManagementProps) {
  const router = useRouter()
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [lang, setLang] = useState(currentLang) // Use parent's language
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [projectTranslations, setProjectTranslations] = useState<Record<string, any>>({})

  useEffect(() => {
    setLang(currentLang)
  }, [currentLang])

  // Загрузка проектов
  useEffect(() => {
    loadArticles()
  }, [])

  useEffect(() => {
    loadProjectTranslations()
  }, [lang, articles])

  useEffect(() => {
    const handler = () => handleAddArticle()
    window.addEventListener("admin-add-project", handler as EventListener)
    return () => window.removeEventListener("admin-add-project", handler as EventListener)
  }, [])

  useEffect(() => {
    const handler = () => handleCancel()
    window.addEventListener("admin-cancel-edit", handler as EventListener)
    return () => window.removeEventListener("admin-cancel-edit", handler as EventListener)
  }, [])

  const mapProject = (n: ProjectRow): NewsArticle => ({
    id: n.id,
    title: n.title,
    description: n.description || "",
    content: n.content || "",
    image: n.image || "",
    contentImage: n.content_image || n.image || "",
    badges: n.badges || [],
    investmentYear: n.investment_year || (n.created_at ? new Date(n.created_at).getFullYear() : undefined),
    contentSections: n.content_sections || (n.content ? [{ text: n.content }] : []),
    published: !!n.published,
    show_on_homepage: !!n.show_on_homepage,
    createdAt: n.created_at,
    updatedAt: n.updated_at,
  })

  const loadArticles = async () => {
    try {
      const list = await ProjectService.getAllProjects()
      setArticles((list || []).map(mapProject))
    } catch (e) {
      console.error("Failed to load projects:", e)
      setArticles([])
    }
  }

  const handleAddArticle = () => {
    const now = new Date().toISOString()
    const newArticle: NewsArticle = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      content: "",
      image: "",
      published: false,
      show_on_homepage: false,
      createdAt: now,
      updatedAt: now,
      badges: [],
      investmentYear: new Date().getFullYear(),
      contentImage: "",
      contentSections: [{ title: "", text: "" }],
    }
    setEditingArticle(newArticle)
    setShowAddForm(true)
    try {
      window.dispatchEvent(new CustomEvent("admin-editing-project", { detail: { editing: true } }))
    } catch {}
  }

  const handleEditArticle = (article: NewsArticle) => {
    const extendedArticle = {
      ...article,
      contentImage: (article as any).contentImage || "",
      images: (article as any).images || [],
      badges: (article as any).badges || [],
      investmentYear: (article as any).investmentYear || new Date().getFullYear(),
      contentSections: (article as any).contentSections || [
        { title: "", text: article.content || article.description || "" },
      ],
    }

    setEditingArticle(extendedArticle as any)
    setShowAddForm(false)
    try {
      window.dispatchEvent(new CustomEvent("admin-editing-project", { detail: { editing: true } }))
    } catch {}
  }

  const handleSaveArticle = async (articleData: any) => {
    try {
      console.log(" Saving article:", articleData)

      if (showAddForm) {
        const insertPayload: any = {
          id: articleData.id,
          title: articleData.title || "Untitled Project", // Use English title
          description: articleData.description,
          content: articleData.content,
          image: articleData.image,
          content_image: articleData.contentImage,
          badges: articleData.badges || [],
          investment_year: Number(articleData.investmentYear) || new Date().getFullYear(),
          content_sections: articleData.contentSections,
          published: articleData.published,
          show_on_homepage: articleData.show_on_homepage,
          created_at: articleData.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        console.log(" Creating project with payload:", insertPayload)
        const result = await ProjectService.createProject(insertPayload)

        if (!result) {
          throw new Error("Failed to create project")
        }

        console.log(" Project created successfully:", result)
      } else {
        const updates: any = {
          title: articleData.title,
          description: articleData.description,
          content: articleData.content,
          image: articleData.image,
          content_image: articleData.contentImage,
          badges: articleData.badges || [],
          investment_year: Number(articleData.investmentYear) || new Date().getFullYear(),
          content_sections: articleData.contentSections,
          published: articleData.published,
          show_on_homepage: articleData.show_on_homepage,
          created_at: articleData.createdAt,
          updated_at: new Date().toISOString(),
        }

        console.log(" Updating project with payload:", updates)
        const result = await ProjectService.updateProject(articleData.id, updates)

        if (!result) {
          throw new Error("Failed to update project")
        }

        console.log(" Project updated successfully:", result)
      }

      await loadArticles()
      setEditingArticle(null)
      setShowAddForm(false)
      try {
        window.dispatchEvent(new CustomEvent("admin-editing-project", { detail: { editing: false } }))
      } catch {}
    } catch (error) {
      console.error(" Error saving article:", error)
      alert("Ошибка при сохранении статьи: " + (error as Error).message)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (confirm("Вы уверены, что хотите удалить эту новость?")) {
      await ProjectService.deleteProject(id)
      await loadArticles()
    }
  }

  const handleCancel = () => {
    setEditingArticle(null)
    setShowAddForm(false)
    try {
      window.dispatchEvent(new CustomEvent("admin-editing-project", { detail: { editing: false } }))
    } catch {}
  }

  const loadProjectTranslations = async () => {
    try {
      console.log(" Loading translations for", articles.length, "projects")
      const translations: Record<string, any> = {}

      for (const article of articles) {
        try {
          const res = await fetch(`/api/admin/projects/${article.id}/translations`)
          if (res.ok) {
            const data = await res.json()
            console.log(` Loaded translations for ${article.id}:`, data)
            translations[article.id] = data
          }
        } catch (err) {
          console.error(` Error loading translations for ${article.id}:`, err)
        }
      }

      console.log(" All project translations loaded:", translations)
      setProjectTranslations(translations)
    } catch (error) {
      console.error(" Error loading project translations:", error)
    }
  }

  if (editingArticle) {
    return (
      <NewsEditForm article={editingArticle as any} onSave={handleSaveArticle} onCancel={handleCancel} hideHeader />
    )
  }

  return (
    <div className="space-y-6">
      {/* Список проектов */}
      <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <CardContent className="pt-4">
          {articles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Проектов пока нет</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => {
                const trans = projectTranslations[article.id] || {}
                const title = trans.title?.[lang] || article.title
                const description = trans.sections?.[lang]?.[0]?.text || article.description || ""
                const badges = trans.badges || []

                console.log(` Rendering project ${article.id}:`, { title, description, badges })

                return (
                  <div key={article.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        {article.image && (
                          <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                            <img
                              src={article.image || "/placeholder.svg"}
                              alt={title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{title}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium border ${
                                article.published
                                  ? "bg-green-600 text-white border-green-600"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              {article.published ? "Опубликовано" : "Черновик"}
                            </span>
                            {article.show_on_homepage && (
                              <span className="text-xs px-2 py-1 rounded-full font-medium border bg-blue-50 text-blue-700 border-blue-200">
                                На главной
                              </span>
                            )}
                            {badges.map((badge: any, i: number) => {
                              const badgeLabel = badge[lang] || badge.en || ""
                              const badgeColor = (article as any).badges?.[i]?.color || "#3b82f6"

                              if (!badgeLabel) return null

                              return (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-0.5 rounded-full border"
                                  style={{
                                    backgroundColor: `${badgeColor}20`,
                                    color: badgeColor,
                                    borderColor: `${badgeColor}40`,
                                  }}
                                >
                                  {badgeLabel}
                                </span>
                              )
                            })}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Создано: {formatDate(article.createdAt)}
                            {article.updatedAt && article.updatedAt !== article.createdAt && (
                              <> • Обновлено: {formatDate(article.updatedAt)}</>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button onClick={() => handleEditArticle(article)} size="sm" variant="outline">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Редактировать
                        </Button>
                        <Button
                          onClick={() => handleDeleteArticle(article.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
