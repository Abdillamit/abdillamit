// URL of every page in both languages. English lives at the root,
// Russian under /ru/.

export const pageRoutes = {
  about: { en: "/", ru: "/ru/" },
  resume: { en: "/resume/", ru: "/ru/resume/" },
  blog: { en: "/blog/", ru: "/ru/blog/" },
}

export const postPath = (lang, slug) =>
  lang === "ru" ? `/ru/blog/${slug}/` : `/blog/${slug}/`

// Props for the site layout, worked out from the page URL. The layout
// wraps every page (see wrap-page-element.js), so it stays mounted while
// the reader moves between pages and the header can animate.
//   pageContext.translations: other language versions of a blog post
//   pageContext.notFound: set for the 404 page in gatsby-node.js
export const layoutProps = (pathname = "/", pageContext = {}) => {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`
  const lang = path.startsWith("/ru/") ? "ru" : "en"
  const rest = lang === "ru" ? path.slice("/ru".length) : path

  if (pageContext?.notFound) {
    return {
      lang,
      current: undefined,
      translations: pageRoutes.about,
      isPost: false,
      pathname: path,
    }
  }

  const current =
    rest === "/"
      ? "about"
      : ["resume", "blog"].find(section =>
          rest.startsWith(pageRoutes[section].en)
        )
  const isPost = /^\/blog\/[^/]+\/$/.test(rest)
  const translations = pageContext?.translations
    ? { ...pageRoutes.blog, ...pageContext.translations }
    : pageRoutes[current] || pageRoutes.about

  return { lang, current, translations, isPost, pathname: path }
}

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
