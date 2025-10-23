import { HomepageService } from "@/lib/supabase-services"

export interface HomepageData {
  heroImage: string
  mobileMenuBg: string
  footerBg: string
  aboutImage?: string
  stat1Title?: string
  stat2Title?: string
  stat3Title?: string
  footerEmail?: string
  footerCopyright?: string
  heroTitle: string
  heroSubtitle: string
  aboutText: string
  aboutDescription: string
  faqItems: any[]
  reviews: any[]
  currencyRates: any[]
  tickerTexts: any[]
  portfolioItems: any[]
  stats: any[]
  imageGallery: any[]
}

const defaultHomepageData: HomepageData = {
  heroImage: "/hero-bg.jpg",
  mobileMenuBg: "/hero-bg.jpg",
  footerBg: "/hero-bg.jpg",
  aboutImage: "/placeholder.svg",
  stat1Title: "$50M+",
  stat2Title: "25+",
  stat3Title: "15+",
  footerEmail: "altay@falahpartners.com",
  footerCopyright: "© 2025 Al Falah Capital Partners",
  heroTitle: "Empowering Innovation Through Strategic Venture Investment",
  heroSubtitle: "We partner with visionary entrepreneurs and groundbreaking startups to build the future.",
  aboutText: "Building Tomorrow's Success Stories Today",
  aboutDescription: "We are a leading venture capital firm...",
  faqItems: [],
  reviews: [],
  currencyRates: [],
  tickerTexts: [],
  portfolioItems: [],
  stats: [],
  imageGallery: [],
}

export async function getHomepageData(bustCache = false): Promise<HomepageData> {
  try {
    console.log(" Fetching homepage data from Supabase...")
    const config = await HomepageService.getHomepageData()
    console.log(" Received homepage data:", JSON.stringify(config).substring(0, 500))

    let stat1Title = defaultHomepageData.stat1Title
    let stat2Title = defaultHomepageData.stat2Title
    let stat3Title = defaultHomepageData.stat3Title

    const statisticsData = (config as any)?.statistics
    if (statisticsData && typeof statisticsData === "object") {
      // ONLY use the nested structure: statistics.stat1.title
      if (statisticsData.stat1?.title) {
        stat1Title = statisticsData.stat1.title
      }
      if (statisticsData.stat2?.title) {
        stat2Title = statisticsData.stat2.title
      }
      if (statisticsData.stat3?.title) {
        stat3Title = statisticsData.stat3.title
      }
    }

    console.log(" Extracted statistics:", { stat1Title, stat2Title, stat3Title })

    let footerEmail = defaultHomepageData.footerEmail
    let footerCopyright = defaultHomepageData.footerCopyright

    const footerData = (config as any)?.footer
    if (footerData && typeof footerData === "object") {
      if (footerData.email) {
        footerEmail = footerData.email
      }
      if (footerData.copyright) {
        footerCopyright = footerData.copyright
      }
    }

    console.log(" Extracted footer data:", { footerEmail, footerCopyright })

    return {
      ...defaultHomepageData,
      heroImage: (config as any)?.hero?.image ?? defaultHomepageData.heroImage,
      mobileMenuBg: (config as any)?.mobile_menu_bg?.image ?? defaultHomepageData.mobileMenuBg,
      footerBg: (config as any)?.footer_bg?.image ?? defaultHomepageData.footerBg,
      aboutImage: (config as any)?.about?.image ?? defaultHomepageData.aboutImage,
      stat1Title,
      stat2Title,
      stat3Title,
      footerEmail,
      footerCopyright,
      heroTitle: defaultHomepageData.heroTitle,
      heroSubtitle: defaultHomepageData.heroSubtitle,
      aboutText: defaultHomepageData.aboutText,
      aboutDescription: defaultHomepageData.aboutDescription,
      faqItems: Array.isArray((config as any)?.faq_items) ? (config as any).faq_items : defaultHomepageData.faqItems,
      reviews: Array.isArray((config as any)?.reviews) ? (config as any).reviews : defaultHomepageData.reviews,
      currencyRates: Array.isArray((config as any)?.currency_rates)
        ? (config as any).currency_rates
        : defaultHomepageData.currencyRates,
      tickerTexts: Array.isArray((config as any)?.ticker_texts)
        ? (config as any).ticker_texts
        : defaultHomepageData.tickerTexts,
      portfolioItems: Array.isArray((config as any)?.portfolio_items)
        ? (config as any).portfolio_items
        : defaultHomepageData.portfolioItems,
      stats: Array.isArray((config as any)?.statistics) ? [(config as any).statistics] : defaultHomepageData.stats,
      imageGallery: Array.isArray((config as any)?.image_gallery)
        ? (config as any).image_gallery
        : defaultHomepageData.imageGallery,
    }
  } catch (error) {
    console.error(" Error fetching homepage data from Supabase:", error)
    return defaultHomepageData
  }
}
