import { getTeamMemberData } from "@/lib/team-data"
import TeamMemberClientPage from "./client-page"

export const revalidate = 60

interface MemberData {
  firstName: string
  lastName: string
  role: string
  photo?: string
  bioLeft: string
  bioRight: string
}

const members: MemberData[] = [
  {
    firstName: "Nurlan",
    lastName: "Kussainov",
    role: "Managing Partner",
    photo: "/placeholder.svg",
    bioLeft:
      "Nurlan has more than two decades of leadership across Kazakhstan's financial sector and public institutions. His experience spans the Astana International Financial Centre, the National Bank of Kazakhstan, the Development Bank of Kazakhstan, the Center of Marketing and Analytical Research under the Government of Kazakhstan, CNRG Capital and the Ministry of Economic Affairs and Budget Planning.",
    bioRight:
      "He holds a master's degree from the Stanford Graduate School of Business. Nurlan serves on the boards of the Astana International Exchange (a Nasdaq subsidiary) and Beeline Kazakhstan. Previously he was Chairman of the Board of Directors at Alfa‑Bank Kazakhstan, CEO of AIFC and the Development Bank of Kazakhstan, and Deputy Governor of the Central Bank of Kazakhstan.",
  },
  {
    firstName: "Diyar",
    lastName: "Medeubekov",
    role: "Chief Investment Officer",
    photo: "/placeholder.svg",
    bioLeft:
      "Diyar oversees investment strategy and has managed several of the fund's portfolio companies. He brings deep operating and financial experience across mining, agriculture and financial services, and earlier served as Director of Project Finance at the Development Bank of Kazakhstan. He holds a master's degree in Economics from Vanderbilt University.",
    bioRight:
      "Alongside his work with the fund, Diyar has founded and scaled technology ventures, including the fintech platforms Pulman.uz in Uzbekistan and Akshamat.kz in Kazakhstan, as well as the AI software company Fantoramma.org. He previously led Alsad.kz as CEO and held roles at the Islamic Development Bank and the Development Bank of Kazakhstan.",
  },
  {
    firstName: "Altay",
    lastName: "Mamanbayev",
    role: "Chief Operating Officer",
    photo: "/placeholder.svg",
    bioLeft:
      "Altay has led the fund's operations since 2008. Before joining Al Falah, he worked as a financial consultant at Eurasia Financial Management Consulting and held managerial positions at Panalpina World Transport LLP in Kazakhstan, one of the world's leading freight‑forwarding corporations.",
    bioRight:
      "A fellow of the ACCA and a certified auditor, Altay has over twenty years of experience in finance. His expertise covers corporate governance, taxation, budgeting, audit, reporting and regulatory compliance. He has held leadership roles at Al Falah Group and Panalpina.",
  },
  {
    firstName: "Azhar",
    lastName: "Babayeva",
    role: "Reporting Manager",
    photo: "/placeholder.svg",
    bioLeft:
      "Azhar joined Al Falah in October 2013 and today oversees financial reporting and compliance. She has more than fifteen years of experience across finance, audit, tax, budgeting and fund administration, and began her career as an auditor at EY Kazakhstan.",
    bioRight:
      "Azhar earned both her bachelor's and master's degrees from KIMEP University and is currently pursuing the ACCA professional qualification.",
  },
]

function slugifyMember(m: MemberData): string {
  return `${m.firstName} ${m.lastName}`
    .toLowerCase()
    .replace(/[^a-z\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export async function generateStaticParams() {
  return members.map((member) => ({
    slug: slugifyMember(member),
  }))
}

export default async function TeamMemberPage({ params }: { params: { slug: string } }) {
  // Load member data on the server
  const memberData = await getTeamMemberData(params.slug)

  // Find fallback data from hardcoded members
  const fallbackMember = members.find((m) => slugifyMember(m) === params.slug)

  // Pass server-loaded data to client component
  return <TeamMemberClientPage memberData={memberData} fallbackData={fallbackMember || null} slug={params.slug} />
}
