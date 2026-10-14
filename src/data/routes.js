// URL of every page in both languages. English lives at the root,
// Russian under /ru/.

export const pageRoutes = {
  about: { en: "/", ru: "/ru/" },
  resume: { en: "/resume/", ru: "/ru/resume/" },
  blog: { en: "/blog/", ru: "/ru/blog/" },
}

export const postPath = (lang, slug) =>
  lang === "ru" ? `/ru/blog/${slug}/` : `/blog/${slug}/`

// "2026-05-03" -> "May 3, 2026" / "3 мая 2026 г." without the "г."
export const formatLongDate = (value, lang) => {
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`)
  const text = date.toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
  return text.replace(/\s?г\.$/, "")
}
