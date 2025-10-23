"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PageLoader from "@/components/ui/page-loader"

export default function AdminLoading() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/me', { cache: 'no-store' })
        const data = await res.json()
        if (!data?.user) {
          router.push("/admin/login")
          return
        }
        setTimeout(() => setIsLoading(false), 800)
      } catch (error) {
        console.error("Error checking auth:", error)
        router.push("/admin/login")
        return
      }
    }

    checkAuth()
  }, [router])

  return (
    <PageLoader
      isLoading={isLoading}
      loadingText="Загрузка панели управления..."
      onLoadingComplete={() => setIsLoading(false)}
    />
  )
}
