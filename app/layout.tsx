import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { inter, rubik, daysOne } from "@/styles/fonts"

export const metadata: Metadata = {
  title: "Al Falah Partners - Venture Capital Investment Firm",
  description:
    "Al Falah Partners is a leading venture capital firm focused on investing in innovative startups and emerging technologies. We partner with entrepreneurs to build the future.",
  keywords:
    "venture capital, startup investment, Al Falah Partners, VC firm, early stage investing, growth capital, technology investment, startup funding",
  generator: "Al Falah Partners",
  icons: {
    icon: [
      { url: "/al-falah-favicon.svg", type: "image/svg+xml" },
      { url: "/al-falah-favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/al-falah-favicon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Al Falah Partners - Venture Capital Investment",
    description: "Leading venture capital firm investing in innovative startups and emerging technologies.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${rubik.variable} ${daysOne.variable} py-0 mb-0 bg-background`}>
      <body className="font-sans bg-gray-900 text-white">
        {children}
      </body>
    </html>
  )
}
