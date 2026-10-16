import { pageRoutes, postPath, formatLongDate, layoutProps } from "../routes"
import { toPost, postsFrom } from "../posts"
import { site } from "../site"

describe("routes", () => {
  it("keeps English at the root and Russian under /ru/", () => {
    Object.values(pageRoutes).forEach(route => {
      expect(route.ru).toBe(`/ru${route.en}`)
    })
    expect(postPath("en", "hello")).toBe("/blog/hello/")
    expect(postPath("ru", "hello")).toBe("/ru/blog/hello/")
  })

  it("formats long dates in both languages", () => {
    expect(formatLongDate("2026-05-03", "en")).toBe("May 3, 2026")
    expect(formatLongDate("2026-05-03T00:00:00.000Z", "ru")).toBe("3 мая 2026")
  })
})

describe("layoutProps", () => {
  it("finds the language and section of every page", () => {
    const cases = [
      ["/", "en", "about"],
      ["/ru/", "ru", "about"],
      ["/resume/", "en", "resume"],
      ["/ru/resume/", "ru", "resume"],
      ["/blog/", "en", "blog"],
      ["/ru/blog/", "ru", "blog"],
    ]
    cases.forEach(([path, lang, current]) => {
      const props = layoutProps(path)
      expect([props.lang, props.current, props.isPost]).toEqual([
        lang,
        current,
        false,
      ])
      expect(props.translations).toEqual(pageRoutes[current])
    })
  })

  it("adds a missing trailing slash", () => {
    expect(layoutProps("/ru/resume")).toMatchObject({
      lang: "ru",
      current: "resume",
      pathname: "/ru/resume/",
    })
  })

  it("does not take /russia/ for a Russian page", () => {
    expect(layoutProps("/russia/")).toMatchObject({
      lang: "en",
      current: undefined,
    })
  })

  it("marks blog posts and keeps their translations", () => {
    const translations = { en: "/blog/a/", ru: "/ru/blog/a/" }
    expect(layoutProps("/ru/blog/a/", { translations })).toEqual({
      lang: "ru",
      current: "blog",
      translations,
      isPost: true,
      pathname: "/ru/blog/a/",
    })
    expect(
      layoutProps("/blog/b/", { translations: { en: "/blog/b/" } })
    ).toMatchObject({
      isPost: true,
      translations: { en: "/blog/b/", ru: "/ru/blog/" },
    })
  })

  it("treats the 404 page as no section", () => {
    expect(layoutProps("/blog/missing/", { notFound: true })).toEqual({
      lang: "en",
      current: undefined,
      translations: pageRoutes.about,
      isPost: false,
      pathname: "/blog/missing/",
    })
  })

  it("defaults to the English home page", () => {
    expect(layoutProps()).toMatchObject({ lang: "en", current: "about" })
    expect(layoutProps("/unknown/").translations).toEqual(pageRoutes.about)
  })
})

describe("posts", () => {
  it("turns markdown nodes into posts", () => {
    const node = {
      readingTime: 3,
      frontmatter: {
        title: "T",
        description: "D",
        date: "2026-05-03T00:00:00.000Z",
        slug: "s",
      },
    }

    expect(toPost(node)).toEqual({
      title: "T",
      description: "D",
      date: "2026-05-03",
      slug: "s",
      timeToRead: 3,
    })
    expect(postsFrom({ allMarkdownRemark: { nodes: [node] } })).toHaveLength(1)
    expect(postsFrom(undefined)).toEqual([])
  })
})

describe("site text", () => {
  it("has the same keys in both languages", () => {
    const keys = value =>
      value && typeof value === "object" && !Array.isArray(value)
        ? Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, keys(item)])
          )
        : Array.isArray(value)
        ? value.length
        : typeof value

    expect(keys(site.ru)).toEqual(keys(site.en))
  })
})
