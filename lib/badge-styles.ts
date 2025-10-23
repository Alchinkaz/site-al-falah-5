export function getSectorBadgeClasses(sector: string): string {
  const normalized = sector.toLowerCase()
  if (normalized.includes("agri")) return "bg-amber-100 text-amber-800"
  if (normalized.includes("energy")) return "bg-blue-100 text-blue-800"
  if (normalized.includes("mining")) return "bg-yellow-100 text-yellow-800"
  if (normalized.includes("venture")) return "bg-purple-100 text-purple-800"
  return "bg-gray-100 text-gray-800"
}

export function getStageBadgeClasses(stage: string): string {
  const normalized = stage.toLowerCase()
  if (normalized.includes("turnaround")) return "bg-rose-100 text-rose-800"
  if (normalized.includes("growth")) return "bg-emerald-100 text-emerald-800"
  if (normalized.includes("lbo")) return "bg-indigo-100 text-indigo-800"
  if (normalized.includes("greenfield")) return "bg-teal-100 text-teal-800"
  if (normalized.includes("fund")) return "bg-cyan-100 text-cyan-800"
  return "bg-green-100 text-green-800"
}
