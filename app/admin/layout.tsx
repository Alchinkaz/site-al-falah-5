"use client"

import type React from "react"
//

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SettingsIcon, LogOut, Menu, X, FileText, Home } from "lucide-react"
import Link from "next/link"

type User = { id: string; username: string; role?: string }

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Use light theme for admin pages (login and dashboard)
  useEffect(() => {
    document.documentElement.classList.remove("dark")
  }, [pathname])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" })
        const data = await res.json()
        if (data?.user) {
          setCurrentUser(data.user)
          setIsAuthenticated(true)
        } else {
          router.push("/admin/login")
          return
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        router.push("/admin/login")
        return
      } finally {
        setIsLoading(false)
      }
    }

    // Не проверяем авторизацию на странице логина
    if (pathname === "/admin/login") {
      setIsLoading(false)
      return
    }

    checkAuth()
  }, [router, pathname])

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
    } finally {
      router.push("/admin/login")
    }
  }

  const getAvailableTabs = (user: User) => {
    return [
      { value: "/admin/homepage", label: "Главная страница", icon: Home },
      { value: "/admin/about", label: "О компании", icon: FileText },
      { value: "/admin/portfolio", label: "Портфолио", icon: FileText },
      { value: "/admin/profile", label: "Профиль", icon: SettingsIcon },
    ]
  }

  // Показываем загрузку только если проверяем авторизацию
  if (isLoading && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Проверка авторизации...</p>
        </div>
      </div>
    )
  }

  // Если не авторизован и не на странице логина, показываем загрузку (редирект произойдет)
  if (!isAuthenticated && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Перенаправление...</p>
        </div>
      </div>
    )
  }

  // Если на странице логина, показываем только контент
  if (pathname === "/admin/login") {
    return children
  }

  const availableTabs = getAvailableTabs(currentUser!)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg.white border border-gray-200"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Link href="/" aria-label="На главную">
                <img
                  src="/al-falah-logo-black-full.svg"
                  alt="Al Falah Capital Partners"
                  className="h-12 w-auto cursor-pointer"
                />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {availableTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = pathname === tab.value
                return (
                  <Link
                    key={tab.value}
                    href={tab.value}
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors ${
                      isActive ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-100 text-gray-700 text-sm">
                    {currentUser?.username?.charAt(0)?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text.sm font-medium text-gray-900 truncate">{currentUser?.username}</p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.role === "admin" ? "Администратор" : "Редактор"}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <div className="p-6 lg:p-8">{children}</div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
