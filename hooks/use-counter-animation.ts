"use client"

import { useState, useEffect, useRef } from "react"

interface UseCounterAnimationProps {
  end: number
  duration?: number
  startOnView?: boolean
}

export function useCounterAnimation({ end, duration = 2000, startOnView = true }: UseCounterAnimationProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (end > 0 && !hasAnimated) {
      setCount(0)
      setIsVisible(false)
      setHasAnimated(false)
    }
  }, [end, hasAnimated])

  useEffect(() => {
    if (end === 0) return // Don't animate if no target value

    if (!startOnView) {
      // Start animation immediately
      animateCount()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible && !hasAnimated) {
          setIsVisible(true)
          animateCount()
        }
      },
      { threshold: 0.3 },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
      // If element is already in view when data arrives, trigger immediately
      try {
        const rect = elementRef.current.getBoundingClientRect()
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight
        const inView = rect.top < viewportHeight * 0.9 && rect.bottom > 0
        if (inView && !hasAnimated) {
          setIsVisible(true)
          animateCount()
        }
      } catch {}
    }

    return () => observer.disconnect()
  }, [isVisible, startOnView, end, hasAnimated])

  const animateCount = () => {
    if (hasAnimated || end === 0) return

    setHasAnimated(true)

    const startTime = Date.now()
    const startValue = 0

    const updateCount = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeInOutCubic =
        progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

      const currentCount = Math.round(startValue + (end - startValue) * easeInOutCubic)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(updateCount)
  }

  return { count, elementRef }
}
