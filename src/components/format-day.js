// "2026-10-12" -> "12.10.2026"
export const formatDay = value => {
  const [year, month, day] = value.split("-")
  return `${day}.${month}.${year}`
}
