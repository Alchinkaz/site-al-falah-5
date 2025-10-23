"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"

type User = {
  id: string
  username: string
  role?: string
  last_login?: string | null
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" })
        const data = await res.json()
        setCurrentUser(data?.user || null)
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!currentUser) return

    // Validate new password
    if (passwordData.newPassword.length < 6) {
      setError("Новый пароль должен содержать минимум 6 символов")
      return
    }

    // Validate password confirmation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    try {
      // Verify current password by trying to login
      const authRes = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser.username, password: passwordData.currentPassword }),
      })
      if (!authRes.ok) {
        setError("Неверный текущий пароль")
        return
      }

      // Update password via service role API
      const res = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser.username, newPassword: passwordData.newPassword }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json?.error || "Не удалось обновить пароль в базе данных")
        return
      }

      setMessage("Пароль успешно изменен")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setIsChangingPassword(false)
    } catch (error) {
      console.error("Password change error:", error)
      setError("Ошибка при изменении пароля")
    }
  }

  const formatDate = (dateString?: string | null) => {
    try {
      if (!dateString) return "Дата не указана"
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Дата не указана"
      }
      return date.toLocaleString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Дата не указана"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Загрузка...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Профиль администратора</h1>
        <p className="text-gray-600">Управление настройками аккаунта</p>
      </div>

      {/* Security Card */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Безопасность</CardTitle>
        </CardHeader>
        <CardContent>
          {!isChangingPassword ? (
            <div>
              <p className="text-gray-600 mb-4">Измените пароль для обеспечения безопасности вашего аккаунта</p>
              <Button
                onClick={() => setIsChangingPassword(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Изменить пароль
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-gray-900">
                  Текущий пароль
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="pr-10 bg-white border-gray-300 text-gray-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-gray-900">
                  Новый пароль
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="pr-10 bg-white border-gray-300 text-gray-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-900">
                  Подтвердите новый пароль
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="pr-10 bg-white border-gray-300 text-gray-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert className="border-green-600 bg-green-50">
                  <AlertDescription className="text-green-700">{message}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  Сохранить пароль
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 text-gray-900 hover:bg-gray-100 bg-transparent"
                  onClick={() => {
                    setIsChangingPassword(false)
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })
                    setError("")
                    setMessage("")
                  }}
                >
                  Отмена
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
