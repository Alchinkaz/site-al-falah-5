export type Lang = "en" | "ru" | "kz"

export const defaultLang: Lang = "en"

// Function to get translations from localStorage or default
function getTranslations() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("i18n-translations")
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error("Error loading i18n translations from localStorage:", error)
      }
    }
  }
  return null
}

const defaultTranslations = {
  heroTitle: {
    en: "Capitalizing on Emerging Opportunities",
    ru: "Используем возможности растущих рынков",
    kz: "Өсіп келе жатқан мүмкіндіктерді іске асырамыз",
  },
  heroButton: {
    en: "View Portfolio",
    ru: "Портфолио",
    kz: "Портфолио",
  },
  homePortfolioTitle: {
    en: "Portfolio",
    ru: "Портфолио",
    kz: "Портфолио",
  },
  homePortfolioSubtitle: {
    en: "Successful investments that helped our portfolio companies scale and grow",
    ru: "Успешные инвестиции, которые помогли нашим компаниям расти и масштабироваться",
    kz: "Біздің портфельдік компаниялардың өсуіне және ауқымын кеңейтуіне көмектескен инвестициялар",
  },
  portfolioViewAll: {
    en: "View All",
    ru: "Смотреть все",
    kz: "Барлығын көру",
  },
  aboutTitle: {
    en: "About Us",
    ru: "О компании",
    kz: "Біз туралы",
  },
  // Shortened sample about text; can be replaced by CMS later
  aboutParagraphs: {
    en: [
      "We invest across energy, agriculture, industry and technology, partnering with ambitious teams to build durable value.",
      "Our principals have executed dozens of transactions across Central Asia, combining capital with deep operating expertise.",
    ],
    ru: [
      "Мы инвестируем в энергетику, агро‑промышленность, промышленность и технологии, сотрудничая с амбициозными командами для создания устойчивой стоимости.",
      "Наши партнёры реализовали десятки сделок в Центральной Азии, сочетая капитал с глубокой операционной экспертизой.",
    ],
    kz: [
      "Біз энергетика, агроөнеркәсіп, индустрия және технология салаларына инвестиция саламыз және құн құратын командалармен серіктесеміз.",
      "Біздің серіктестер Орталық Азияда ондаған мәміле жүзеге асырып, капиталды терең операциялық тәжірибемен ұштастырады.",
    ],
  },
  // About page (dedicated) — separate from homepage About teaser
  aboutPageTitle: {
    en: "About Us",
    ru: "О компании",
    kz: "Біз туралы",
  },
  aboutPageParagraphs: {
    en: [
      "We make investments in companies across energy, mining, agriculture, food production, high‑tech, healthcare and other sectors.",
      "Leveraging deep regional expertise and a strong network, we are raising the Falah Growth Fund II, a USD200 million private equity fund focused on emerging opportunities and long‑term value creation.",
      "Al Falah Capital Partners is headquartered in Almaty. Since 2008, our principals have invested in or acquired dozens of companies including Karaganda Energocenter, Ulmus Besshoky, Alsad Kazakhstan, Ai Karaaul, Karaganda Kus, Elefund VC funds, Robinhood Inc., Soul of Nomad Inc. and others.",
      "Central Asia is a rapidly growing region with exceptional entrepreneurs. We remain focused on its potential and are ready to partner with new investors to capture the next wave of growth.",
    ],
    ru: [
      "Мы инвестируем в компании из сфер энергетики, добычи, сельского хозяйства, производства продуктов питания, высоких технологий, здравоохранения и других отраслей.",
      "Опираясь на глубокую региональную экспертизу и сильную сеть партнёров, мы формируем Falah Growth Fund II — частный фонд объёмом 200 млн долларов США, нацеленный на новые возможности и создание долгосрочной стоимости.",
      "Штаб‑квартира Al Falah Capital Partners находится в Алматы. С 2008 года наши партнёры инвестировали или приобрели десятки компаний, среди которых Karaganda Energocenter, Ulmus Besshoky, Alsad Kazakhstan, Ai Karaaul, Karaganda Kus, фонды Elefund VC, Robinhood Inc., Soul of Nomad Inc. и другие.",
      "Центральная Азия — быстрорастущий регион с талантливыми предпринимателями. Мы сосредоточены на его потенциале и готовы вместе с новыми инвесторами использовать следующую волну роста.",
    ],
    kz: [
      "Біз энергетика, тау‑кен өндірісі, ауыл шаруашылығы, тамақ өндірісі, жоғары технологиялар, денсаулық сақтау және басқа салалардағы компанияларға инвестиция саламыз.",
      "Аймақтық тәжірибеміз бен әріптестер желісіне сүйене отырып, біз құны 200 млн АҚШ долларына тең Falah Growth Fund II жеке капитал қорын құрып жатырмыз. Қордың мақсаты — жаңа мүмкіндіктерді пайдалану және ұзақ мерзімді құн қалыптастыру.",
      "Al Falah Capital Partners Алматыда орналасқан. 2008 жылдан бері серіктестеріміз ондаған компанияға инвестиция салып, сатып алды: Karaganda Energocenter, Ulmus Besshoky, Alsad Kazakhstan, Ai Karaaul, Karaganda Kus, Elefund VC қорлары, Robinhood Inc., Soul of Nomad Inc. және басқалары.",
      "Орталық Азия — жылдам дамып келе жатқан өңір. Біз осы әлеуетке сенеміз және жаңа инвесторлармен бірге келесі өсу толқынын игеруге дайынбыз.",
    ],
  },
  // About page key terms rows (editable list)
  aboutPageKeyTermsRows: [
    {
      label: { en: "Size", ru: "Размер", kz: "Өлшемі" },
      value: { en: "USD200m", ru: "USD200 млн", kz: "USD200 млн" },
    },
    {
      label: { en: "GP commitment", ru: "Вклад GP", kz: "GP қатысу үлесі" },
      value: { en: "2%", ru: "2%", kz: "2%" },
    },
    {
      label: { en: "Investment period", ru: "Инвестпериод", kz: "Инвестициялық кезең" },
      value: { en: "3y+2", ru: "3 года + 2", kz: "3 жыл + 2" },
    },
    {
      label: { en: "Term", ru: "Срок", kz: "Мерзім" },
      value: { en: "10y+3", ru: "10 лет + 3", kz: "10 жыл + 3" },
    },
    {
      label: { en: "Hurdle rate", ru: "Барьёрная ставка", kz: "Табалдырық мөлшерлемесі" },
      value: { en: "8%", ru: "8%", kz: "8%" },
    },
    {
      label: { en: "Management fee", ru: "Комиссия за управление", kz: "Басқару комиссиясы" },
      value: { en: "up to 2%", ru: "до 2%", kz: "2%-ға дейін" },
    },
    {
      label: { en: "Carry", ru: "Керри (доля прибыли)", kz: "Кэрри (пайда үлесі)" },
      value: { en: "20% with clawback", ru: "20% с механизмом clawback", kz: "20% (clawback бар)" },
    },
  ],
  // Editable Key terms title override
  aboutPageKeyTermsTitle: { en: "Key terms", ru: "Ключевые условия", kz: "Негізгі шарттар" },
  // Editable Sectors title override
  aboutPageSectorsTitle: { en: "Sectors", ru: "Сектора", kz: "Салалар" },
  // Editable Sectors items (title + description)
  aboutPageSectors: [
    {
      title: { en: "Oil & Gas", ru: "Нефть и газ", kz: "Мұнай‑газ" },
      desc: {
        en: "Reservoirs, Wells, Equipment, Facilities, Marine & Subsea",
        ru: "Месторождения, скважины, оборудование, объекты, морская и подводная инфраструктура",
        kz: "Кен орындары, ұңғылар, жабдық, нысандар, теңіз және су асты инфрақұрылымы",
      },
    },
    {
      title: { en: "Power", ru: "Электроэнергетика", kz: "Энергетика" },
      desc: {
        en: "Generation, Transportation & distribution, Services",
        ru: "Генерация, транспортировка и распределение, сервис",
        kz: "Генерация, тасымалдау және тарату, қызметтер",
      },
    },
    {
      title: { en: "Food & Agro", ru: "Пищепром и агро", kz: "Азық‑түлік және агро" },
      desc: {
        en: "Production, Food processing, Logistics",
        ru: "Производство, переработка продуктов питания, логистика",
        kz: "Өндіріс, азық‑түлік өңдеу, логистика",
      },
    },
    {
      title: {
        en: "Industrial & High‑tech",
        ru: "Индустрия и высокие технологии",
        kz: "Индустрия және жоғары технологиялар",
      },
      desc: {
        en: "Construction & materials, Industrial transportation, Electronic & electrical equipment",
        ru: "Строительство и материалы, промышленный транспорт, электронное и электротехническое оборудование",
        kz: "Құрылыс және материалдар, өндірістік көлік, электронды және электр жабдықтары",
      },
    },
  ],
  stat1Subtitle: {
    en: "Assets Under Management",
    ru: "Активы под управлением",
    kz: "Басқарудағы активтер",
  },
  stat2Subtitle: {
    en: "Portfolio Companies",
    ru: "Портфельные компании",
    kz: "Портфельдік компаниялар",
  },
  stat3Subtitle: {
    en: "Successful Exits",
    ru: "Успешные выходы",
    kz: "Сәтті шығулар",
  },
  ctaTitle: {
    en: ["What future are you building?", "We'd love to connect."],
    ru: ["Какое будущее вы строите?", "Будем рады познакомиться."],
    kz: ["Қандай болашақ құрып жатырсыз?", "Байланысуға қуаныштымыз."],
  },
  footerContactUs: {
    en: "Contact us:",
    ru: "Свяжитесь с нами:",
    kz: "Бізбен байланысыңыз:",
  },
  footerNameAltay: { en: "Altay Mamanbayev", ru: "Алтай Маманбаев", kz: "Алтай Маманбаев" },
  footerRoleAltay: {
    en: "Chief Operating Officer",
    ru: "Исполнительный Директор",
    kz: "Атқарушы Директор",
  },
  footerDevelopedBy: {
    en: "Developed by Web Alchin",
    ru: "Разработано Web Alchin",
    kz: "Web Alchin әзірлеген",
  },
  navHome: { en: "Home", ru: "Главная", kz: "Басты бет" },
  navAbout: { en: "About Us", ru: "О компании", kz: "Біз туралы" },
  navPortfolio: { en: "Portfolio", ru: "Портфолио", kz: "Портфолио" },
}

// Create dynamic i18n object that merges stored translations with defaults
export const i18n = (() => {
  const stored = getTranslations()
  return stored ? { ...defaultTranslations, ...stored } : defaultTranslations
})()

// Function to load translations from Supabase
async function loadTranslationsFromSupabase() {
  if (typeof window === "undefined") return null

  try {
    const response = await fetch("/api/admin/translations/get")
    if (!response.ok) return null

    const data = await response.json()
    return data.translations || null
  } catch (error) {
    console.error(" Error loading translations from Supabase:", error)
    return null
  }
}

export async function refreshI18nFromSupabase() {
  const supabaseTranslations = await loadTranslationsFromSupabase()
  if (supabaseTranslations) {
    // Merge with defaults
    const merged = { ...defaultTranslations, ...supabaseTranslations }

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("i18n-translations", JSON.stringify(supabaseTranslations))
    }

    // Update the i18n object
    Object.assign(i18n, merged)

    console.log(" Translations refreshed from Supabase")
    return merged
  }
  return i18n
}

const defaultTeamI18n: Record<
  string,
  {
    role: { en: string; ru: string; kz: string }
    bioLeft: { en: string; ru: string; kz: string }
    bioRight: { en: string; ru: string; kz: string }
  }
> = {
  "nurlan-kussainov": {
    role: { en: "Managing Partner", ru: "Управляющий Партнер", kz: "Басқарушы Серіктес" },
    bioLeft: {
      en: "Nurlan has more than two decades of leadership across Kazakhstan’s financial sector and public institutions. His experience spans the AIFC, the National Bank of Kazakhstan, the Development Bank of Kazakhstan, the Center of Marketing and Analytical Research, CNRG Capital and the Ministry of Economic Affairs and Budget Planning.",
      ru: "Нурлан более двадцати лет возглавлял проекты в финансовом секторе и государственных институтах Казахстана. Его опыт включает АМФЦА, Национальный банк Казахстана, Банк развития Казахстана, Центр маркетинговых и аналитических исследований, CNRG Capital и Министерство экономики и бюджетного планирования.",
      kz: "Нұрлан Қазақстанның қаржы секторында және мемлекеттік институттарында жиырма жылдан астам жетекшілік тәжірибеге ие. Оның тәжірибесі АХҚО, Қазақстан Ұлттық Банкі, Қазақстанның Даму Банкі, Маркетинг және талдау орталығы, CNRG Capital және Экономика және бюджеттік жоспарлау министрлігін қамтиды.",
    },
    bioRight: {
      en: "He holds a master’s degree from the Stanford Graduate School of Business. Nurlan serves on the boards of the Astana International Exchange and Beeline Kazakhstan, and previously was Chairman of Alfa‑Bank Kazakhstan, CEO of AIFC and the Development Bank of Kazakhstan, and Deputy Governor of the Central Bank of Kazakhstan.",
      ru: "Окончил бизнес‑школу Стэнфорда (MSM). Состоит в советах директоров Astana International Exchange и Beeline Kazakhstan. Ранее возглавлял совет директоров Альфа‑Банк Казахстан, был CEO АМФЦА и Банка развития Казахстана, а также заместителем председателя Нацбанка.",
      kz: "Стэнфорд бизнес мектебінің магистры. Astana International Exchange және Beeline Kazakhstan директорлар кеңесінің мүшесі. Бұған дейін Альфа‑Банк Қазақстан Директорлар кеңесінің төрағасы, АХҚО мен Қазақстанның Даму Банкінің басшысы және Ұлттық Банктің төраға орынбасары болды.",
    },
  },
  "diyar-medeubekov": {
    role: {
      en: "Chief Investment Officer",
      ru: "Главный Директор по инвестициям",
      kz: "Инвестициялар жөніндегі Бас Директор",
    },
    bioLeft: {
      en: "Diyar oversees investment strategy and has managed several of the fund’s portfolio companies. He brings operating and financial experience across mining, agriculture and financial services, and earlier served as Director of Project Finance at the Development Bank of Kazakhstan. He holds a master’s degree in Economics from Vanderbilt University.",
      ru: "Дияр отвечает за инвестиционную стратегию и управлял портфельными компаниями фонда. Имеет операционный и финансовый опыт в горнодобывающем секторе, агро‑проме и финансах. Ранее — директор по проектному финансированию в Банке развития Казахстана. Магистр экономики Vanderbilt University.",
      kz: "Дияр қордың инвестициялық стратегиясын қадағалайды және бірнеше портфельдік компанияларды басқарды. Тау‑кен, агро және қаржы салаларында тәжірибесі бар. Бұған дейін Қазақстанның Даму Банкі жобалық қаржыландыру директоры болды. Vanderbilt University экономика магистрі.",
    },
    bioRight: {
      en: "He founded and scaled technology ventures including Pulman.uz, Akshamat.kz and the AI company Fantoramma.org. He also led Alsad.kz and held roles at the Islamic Development Bank and the Development Bank of Kazakhstan.",
      ru: "Основатель и руководитель технологических проектов Pulman.uz, Akshamat.kz и ИИ‑компании Fantoramma.org. Возглавлял Alsad.kz, занимал руководящие позиции в Исламском банке развития и Банке развития Казахстана.",
      kz: "Pulman.uz, Akshamat.kz және Fantoramma.org сияқты технологиялық жобалардың негізін қалаған. Сондай‑ақ Alsad.kz компаниясын басқарды, Ислам даму банкі мен Қазақстанның Даму Банкі ұйымдарында қызмет етті.",
    },
  },
  "altay-mamanbayev": {
    role: { en: "Chief Operating Officer", ru: "Исполнительный Директор", kz: "Атқарушы Директор" },
    bioLeft: {
      en: "Altay has led the fund’s operations since 2008. Before joining Al Falah, he worked as a financial consultant at Eurasia Financial Management Consulting and held managerial roles at Panalpina World Transport LLP in Kazakhstan.",
      ru: "Алтай руководит операционной деятельностью фонда с 2008 года. До этого работал финансовым консультантом в Eurasia Financial Management Consulting и занимал руководящие позиции в Panalpina World Transport LLP в Казахстане.",
      kz: "Алтай 2008 жылдан бері қордың операциялық қызметін басқарады. Бұған дейін Eurasia Financial Management Consulting компаниясында қаржылық кеңесші болып, Қазақстандағы Panalpina World Transport LLP компаниясында басшылық лауазымдарда болды.",
    },
    bioRight: {
      en: "A fellow of the ACCA and certified auditor, Altay has over twenty years in finance covering governance, taxation, budgeting, audit, reporting and compliance. He has held leadership roles at Al Falah Group and Panalpina.",
      ru: "Член ACCA и сертифицированный аудитор, Алтай имеет более 20 лет опыта в финансах: корпоративное управление, налогообложение, бюджетирование, аудит, отчётность и комплаенс. Занимал руководящие должности в Al Falah Group и Panalpina.",
      kz: "ACCA мүшесі және сертификатталған аудитор. Қаржыда 20 жылдан астам тәжірибе: корпоративтік басқару, салық, бюджеттеу, аудит, есептілік және комплаенс. Al Falah Group және Panalpina компанияларында жетекшілік етті.",
    },
  },
  "azhar-babayeva": {
    role: { en: "Reporting Manager", ru: "Менеджер по отчетности и процессам", kz: "Есеп беру және процесс менеджері" },
    bioLeft: {
      en: "Azhar joined Al Falah in 2013 and today oversees financial reporting and compliance. She has more than fifteen years of experience across finance, audit, tax, budgeting and fund administration, and began her career as an auditor at EY Kazakhstan.",
      ru: "Азхар пришла в Al Falah в 2013 году и сегодня отвечает за финансовую отчётность и комплаенс. Имеет более 15 лет опыта в финансах, аудите, налогах, бюджетировании и администрировании фондов; карьеру начинала аудитором в EY Казахстан.",
      kz: "Азхар 2013 жылы Al Falah компаниясына келді және қазір қаржылық есеп пен комплаенсті қадағалайды. Қаржы, аудит, салық, бюджеттеу және қор әкімшілігі бойынша 15 жылдан астам тәжірибесі бар; мансабын EY Kazakhstan компаниясында аудитор ретінде бастаған.",
    },
    bioRight: {
      en: "Azhar earned bachelor’s and master’s degrees from KIMEP University and is currently pursuing the ACCA professional qualification.",
      ru: "Окончила бакалавриат и магистратуру KIMEP University, в настоящее время проходит профессиональную сертификацию ACCA.",
      kz: "KIMEP University бакалавриаты мен магистратурасын бітірген, қазір ACCA кәсіби біліктілігін алып жатыр.",
    },
  },
}

const defaultTeamNames: Record<string, { en: string; ru: string; kz: string }> = {
  "nurlan-kussainov": { en: "Nurlan Kussainov", ru: "Нурлан Кусаинов", kz: "Нұрлан Құсайынов" },
  "diyar-medeubekov": { en: "Diyar Medeubekov", ru: "Дияр Медеубеков", kz: "Дияр Медеубеков" },
  "altay-mamanbayev": { en: "Altay Mamanbayev", ru: "Алтай Маманбаев", kz: "Алтай Маманбаев" },
  "azhar-babayeva": { en: "Azhar Babayeva", ru: "Ажар Бабаева", kz: "Ажар Бабаева" },
}

// Export dynamic team dictionaries that can be overridden via localStorage
const storedForTeams = getTranslations()
export const teamI18n: Record<
  string,
  {
    role: { en: string; ru: string; kz: string }
    bioLeft: { en: string; ru: string; kz: string }
    bioRight: { en: string; ru: string; kz: string }
  }
> =
  storedForTeams && (storedForTeams as any).teamI18n
    ? { ...defaultTeamI18n, ...((storedForTeams as any).teamI18n as any) }
    : defaultTeamI18n

export const teamNames: Record<string, { en: string; ru: string; kz: string }> =
  storedForTeams && (storedForTeams as any).teamNames
    ? { ...defaultTeamNames, ...((storedForTeams as any).teamNames as any) }
    : defaultTeamNames

// Portfolio pages i18n
const defaultPortfolioI18n = {
  heroTitle: { en: "Our Portfolio", ru: "Наше портфолио", kz: "Біздің портфолио" },
  heroSubtitle: {
    en: "Discover our portfolio of innovative companies transforming industries across Central Asia",
    ru: "Ознакомьтесь с портфелем инновационных компаний, меняющих отрасли в Центральной Азии",
    kz: "Орталық Азиядағы салаларды өзгертетін инновациялық компаниялар портфоліосымен танысыңыз",
  },
  sectorMap: {
    Agriculture: { en: "Agriculture", ru: "Сельское хозяйство", kz: "Агроөнеркәсіп" },
    Energy: { en: "Energy", ru: "Энергетика", kz: "Энергетика" },
    Mining: { en: "Mining", ru: "Добыча", kz: "Тау‑кен" },
    "Venture capital": { en: "Venture capital", ru: "Венчурный капитал", kz: "Венчурлік капитал" },
  } as Record<string, { en: string; ru: string; kz: string }>,
  stageMap: {
    Turnaround: { en: "Turnaround", ru: "Turnaround", kz: "Turnaround" },
    Growth: { en: "Growth", ru: "Рост", kz: "Өсу" },
    LBO: { en: "LBO", ru: "LBO", kz: "LBO" },
    Greenfield: { en: "Greenfield", ru: "Greenfield", kz: "Greenfield" },
    Funds: { en: "Funds", ru: "Фонды", kz: "Қорлар" },
  } as Record<string, { en: string; ru: string; kz: string }>,
}

// Export dynamic portfolio i18n that can be overridden via localStorage
const storedForPortfolio = getTranslations()
export const portfolioI18n =
  storedForPortfolio && (storedForPortfolio as any).portfolioI18n
    ? { ...defaultPortfolioI18n, ...((storedForPortfolio as any).portfolioI18n as any) }
    : defaultPortfolioI18n

const defaultProjectTexts: Record<
  string,
  {
    title: { en: string; ru: string; kz: string }
    content?: { en: string[]; ru: string[]; kz: string[] }
  }
> = {
  "alsad-kazakhstan-llp": {
    title: { en: "Alsad Kazakhstan LLP", ru: "Alsad Kazakhstan LLP", kz: "Alsad Kazakhstan LLP" },
    content: {
      en: [
        "Not operating and pre-bankrupt farm has been turned into the market leader in egg production reaching full capacity of 160 millions high quality eggs per year with a 20% market niche in Almaty region.",
      ],
      ru: [
        "Не работающая предбанкротная птицефабрика была преобразована в лидера рынка: мощность достигла 160 млн качественных яиц в год и 20% доли в Алматинской области.",
      ],
      kz: [
        "Жұмысы тоқтаған құс фабрикасы нарық көшбасшысына айналды: жылына 160 млн сапалы жұмыртқа және Алматы облысында 20% нарық үлесі.",
      ],
    },
  },
  "karaganda-energocenter-llp": {
    title: { en: "Karaganda Energocenter LLP", ru: "Karaganda Energocenter LLP", kz: "Karaganda Energocenter LLP" },
    content: {
      en: [
        "Investment supported the construction of a new 120MW power unit to cover regional deficit; total installed capacity reached 712MW by 2015.",
      ],
      ru: [
        "Инвестиции направлены на строительство нового энергоблока мощностью 120 МВт для покрытия регионального дефицита; установленная мощность достигла 712 МВт к 2015 году.",
      ],
      kz: [
        "Инвестициялар өңірлік тапшылықты жабу үшін 120 МВт жаңа энергия блогын салуға бағытталды; орнатылған қуат 2015 жылға қарай 712 МВт болды.",
      ],
    },
  },
  "karaganda-kus-llp": {
    title: { en: "Karaganda Kus LLP", ru: "Karaganda Kus LLP", kz: "Karaganda Kus LLP" },
    content: {
      en: [
        "Expanded Alsad expertise to Karaganda region with external funding; combined business became the national leader with 300 million eggs capacity.",
      ],
      ru: [
        "Экспертиза Alsad расширена в Карагандинский регион при поддержке внешнего финансирования; объединённый бизнес стал лидером Казахстана с мощностью 300 млн яиц.",
      ],
      kz: [
        "Сыртқы қаржыландырумен Қарағанды өңіріне Alsad тәжірибесі кеңейтілді; біріктірілген бизнес жылына 300 млн жұмыртқамен ел көшбасшысына айналды.",
      ],
    },
  },
  "ulmus-besshoky-jsc": {
    title: { en: "Ulmus Besshoky JSC", ru: "Ulmus Besshoky JSC", kz: "Ulmus Besshoky JSC" },
    content: {
      en: [
        "Early‑stage investment for exploration through feasibility study aiming to expand confirmed resources to 1,167K tons of copper.",
      ],
      ru: [
        "Инвестиции на ранней стадии для разведки до ТЭО с целью нарастить подтверждённые ресурсы до 1 167 тыс. тонн меди.",
      ],
      kz: [
        "Бастапқы кезеңдегі барлау мен ТЭН‑ге дейінгі инвестиция, мақсаты – расталған қорларды 1 167 мың тонна мысқа дейін ұлғайту.",
      ],
    },
  },
  "ai-karaaul-jsc": {
    title: { en: "Ai Karaaul JSC", ru: "Ai Karaaul JSC", kz: "Ai Karaaul JSC" },
    content: {
      en: [
        "Early‑stage investment for exploration through feasibility study aiming to expand confirmed resources to 180K tons of high‑grade copper.",
      ],
      ru: [
        "Инвестиции на ранней стадии для разведки до ТЭО с целью нарастить подтверждённые ресурсы до 180 тыс. тонн медной руды высокого качества.",
      ],
      kz: [
        "Бастапқы кезеңдегі инвестиция барлаудан ТЭН‑ге дейін; мақсат – 180 мың тонна жоғары сапалы мысқа дейін ресурстарды ұлғайту.",
      ],
    },
  },
  "elefund-vc-funds": {
    title: { en: "Elefund VC funds", ru: "Elefund VC funds", kz: "Elefund VC funds" },
    content: {
      en: [
        "Invested across several consecutive VC funds run by world‑class operators and investors building highly profitable businesses.",
      ],
      ru: [
        "Инвестиции в несколько последовательных венчурных фондов с командой мирового уровня, создающих высокодоходные бизнесы.",
      ],
      kz: [
        "Әлемдік деңгейдегі команда басқаратын бірқатар венчурлік қорларға инвестиция салынды, жоғары табысты бизнес құруда.",
      ],
    },
  },
}

const storedProjectTexts = getTranslations()
export const projectTexts: Record<
  string,
  { title: { en: string; ru: string; kz: string }; content?: { en: string[]; ru: string[]; kz: string[] } }
> =
  storedProjectTexts && (storedProjectTexts as any).projectTexts
    ? { ...defaultProjectTexts, ...((storedProjectTexts as any).projectTexts as any) }
    : defaultProjectTexts

// Dynamic per-project sections translations
const storedProjectSections = getTranslations()
export const projectSections: Record<
  string,
  {
    en: Array<{ title: string; text: string }>
    ru: Array<{ title: string; text: string }>
    kz: Array<{ title: string; text: string }>
  }
> =
  storedProjectSections && (storedProjectSections as any).projectSections
    ? ((storedProjectSections as any).projectSections as any)
    : {}

// Dynamic per-project badges labels translations
const storedProjectBadges = getTranslations()
export const projectBadgesI18n: Record<string, Array<{ en: string; ru: string; kz: string }>> = storedProjectBadges &&
(storedProjectBadges as any).projectBadgesI18n
  ? ((storedProjectBadges as any).projectBadgesI18n as any)
  : {}

export function formatDateByLang(dateString: string, lang: Lang): string {
  const date = new Date(dateString)

  if (lang === "kz") {
    // Use Russian locale as fallback for Kazakh since they share similar date formatting
    // and kk-KZ is not widely supported in browsers
    return date.toLocaleDateString("ru-RU", { year: "numeric", month: "long" })
  }

  const locale = lang === "ru" ? "ru-RU" : "en-US"
  return date.toLocaleDateString(locale, { year: "numeric", month: "long" })
}

export function readLang(): Lang {
  if (typeof window === "undefined") return defaultLang
  const v = window.localStorage.getItem("lang") as Lang | null
  return v ?? defaultLang
}

// About page i18n
export const aboutI18n = {
  title: { en: "About Us", ru: "О компании", kz: "Біз туралы" },
  paragraphs: {
    en: [
      "We make investments in companies across energy, mining, agriculture, food production, high‑tech, healthcare and other sectors.",
      "Leveraging deep regional expertise and a strong network, we are raising the Falah Growth Fund II, a USD200 million private equity fund focused on emerging opportunities and long‑term value creation.",
      "Al Falah Capital Partners is headquartered in Almaty. Since 2008, our principals have invested in or acquired dozens of companies including Karaganda Energocenter, Ulmus Besshoky, Alsad Kazakhstan, Ai Karaaul, Karaganda Kus, Elefund VC funds, Robinhood Inc., Soul of Nomad Inc. and others.",
      "Central Asia is a rapidly growing region with exceptional entrepreneurs. We remain focused on its potential and are ready to partner with new investors to capture the next wave of growth.",
    ],
    ru: [
      "Мы инвестируем в компании из сфер энергетики, добычи, сельского хозяйства, производства продуктов питания, высоких технологий, здравоохранения и других отраслей.",
      "Опираясь на глубокую региональную экспертизу и сильную сеть партнёров, мы формируем Falah Growth Fund II — частный фонд объёмом 200 млн долларов США, нацеленный на новые возможности и создание долгосрочной стоимости.",
      "Штаб‑квартира Al Falah Capital Partners находится в Алматы. С 2008 года наши партнёры инвестировали или приобрели десятки компаний, среди которых Karaganda Energocenter, Ulmus Besshoky, Alsad Kazakhstan, Ai Karaaul, Karaganda Kus, фонды Elefund VC, Robinhood Inc., Soul of Nomad Inc. и другие.",
      "Центральная Азия — быстрорастущий регион с талантливыми предпринимателями. Мы сосредоточены на его потенциале и готовы вместе с новыми инвесторами использовать следующую волну роста.",
    ],
    kz: [
      "Біз энергетика, тау‑кен өндірісі, ауыл шаруашылығы, тамақ өндірісі, жоғары технологиялар, денсаулық сақтау және басқа салалардағы компанияларға инвестиция саламыз.",
      "Аймақтық тәжірибеміз бен әріптестер желісіне сүйене отырып, біз құны 200 млн АҚШ долларына тең Falah Growth Fund II жеке капитал қорын құрып жатырмыз. Қордың мақсаты — жаңа мүмкіндіктерді пайдалану және ұзақ мерзімді құн қалыптастыру.",
      "Al Falah Capital Partners Алматыда орналасқан. 2008 жылдан бері серіктестеріміз ондаған компанияға инвестиция салып, сатып алды: Karaganda Energocenter, Ulmus Besshoky, Alsad Kazakhstan, Ai Karaaul, Karaganda Kus, Elefund VC қорлары, Robinhood Inc., Soul of Nomad Inc. және басқалары.",
      "Орталық Азия — жылдам дамып келе жатқан өңір. Біз осы әлеуетке сенеміз және жаңа инвесторлармен бірге келесі өсу толқынын игеруге дайынбыз.",
    ],
  },
  keyTermsTitle: { en: "Key terms", ru: "Ключевые условия", kz: "Негізгі шарттар" },
  keyLabels: {
    Size: { en: "Size", ru: "Размер", kz: "Өлшемі" },
    "GP commitment": { en: "GP commitment", ru: "Вклад GP", kz: "GP қатысу үлесі" },
    "Investment period": { en: "Investment period", ru: "Инвестпериод", kz: "Инвестициялық кезең" },
    Term: { en: "Term", ru: "Срок", kz: "Мерзім" },
    "Hurdle rate": { en: "Hurdle rate", ru: "Барьёрная ставка", kz: "Табалдырық мөлшерлемесі" },
    "Management fee": { en: "Management fee", ru: "Комиссия за управление", kz: "Басқару комиссиясы" },
    Carry: { en: "Carry", ru: "Керри (доля прибыли)", kz: "Кэрри (пайда үлесі)" },
  } as Record<string, { en: string; ru: string; kz: string }>,
  keyTerms: {
    Size: { en: "USD200m", ru: "USD200 млн", kz: "USD200 млн" },
    "GP commitment": { en: "2%", ru: "2%", kz: "2%" },
    "Investment period": { en: "3y+2", ru: "3 года + 2", kz: "3 жыл + 2" },
    Term: { en: "10y+3", ru: "10 лет + 3", kz: "10 жыл + 3" },
    "Hurdle rate": { en: "8%", ru: "8%", kz: "8%" },
    "Management fee": { en: "up to 2%", ru: "до 2%", kz: "2%-ға дейін" },
    Carry: { en: "20% with clawback", ru: "20% с механизмом clawback", kz: "20% (clawback бар)" },
  } as Record<string, { en: string; ru: string; kz: string }>,
  sectorsTitle: { en: "Sectors", ru: "Сектора", kz: "Салалар" },
  sectors: [
    {
      key: "Oil & Gas",
      title: { en: "Oil & Gas", ru: "Нефть и газ", kz: "Мұнай‑газ" },
      desc: {
        en: "Reservoirs, Wells, Equipment, Facilities, Marine & Subsea",
        ru: "Месторождения, скважины, оборудование, объекты, морская и подводная инфраструктура",
        kz: "Кен орындары, ұңғылар, жабдық, нысандар, теңіз және су асты инфрақұрылымы",
      },
    },
    {
      key: "Power",
      title: { en: "Power", ru: "Электроэнергетика", kz: "Энергетика" },
      desc: {
        en: "Generation, Transportation & distribution, Services",
        ru: "Генерация, транспортировка и распределение, сервис",
        kz: "Генерация, тасымалдау және тарату, қызметтер",
      },
    },
    {
      key: "Food & Agro",
      title: { en: "Food & Agro", ru: "Пищепром и агро", kz: "Азық‑түлік және агро" },
      desc: {
        en: "Production, Food processing, Logistics",
        ru: "Производство, переработка продуктов питания, логистика",
        kz: "Өндіріс, азық‑түлік өңдеу, логистика",
      },
    },
    {
      key: "Industrial & High‑tech",
      title: {
        en: "Industrial & High‑tech",
        ru: "Индустрия и высокие технологии",
        kz: "Индустрия және жоғары технологиялар",
      },
      desc: {
        en: "Construction & materials, Industrial transportation, Electronic & electrical equipment",
        ru: "Строительство и материалы, промышленный транспорт, электронное и электротехническое оборудование",
        kz: "Құрылыс және материалдар, өндірістік көлік, электронды және электр жабдықтары",
      },
    },
  ],
  teamTitle: { en: "Meet the team", ru: "Команда", kz: "Команда" },
  // Team photos by slug (used on cards and member pages)
  teamPhotos: {
    "nurlan-kussainov": "/placeholder.svg",
    "diyar-medeubekov": "/placeholder.svg",
    "altay-mamanbayev": "/placeholder.svg",
    "azhar-babayeva": "/placeholder.svg",
  } as Record<string, string>,
}
