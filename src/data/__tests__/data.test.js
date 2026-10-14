import { pageRoutes, postPath, formatLongDate } from "../routes"
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
