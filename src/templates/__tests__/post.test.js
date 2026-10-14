import React from "react"
import { render, screen } from "@testing-library/react"
import PostTemplate, { Head } from "../post"

jest.mock("../../components/layout", () => {
  return function MockLayout({ lang, current, translations, children }) {
    return (
      <div
        data-testid="mock-layout"
        data-lang={lang}
        data-current={current}
        data-en={translations?.en}
        data-ru={translations?.ru}
      >
        {children}
      </div>
    )
  }
})

jest.mock("../../components/seo", () => {
  return function MockSEO({
    title,
    lang,
    path,
    alternates,
    type,
    description,
  }) {
    return (
      <title
        data-testid="mock-seo"
        data-lang={lang}
        data-path={path}
        data-ru={alternates?.ru}
        data-type={type}
        data-description={description}
      >
        {title}
      </title>
    )
  }
})

const data = {
  markdownRemark: {
    html: "<p>I grew up in Baul.</p>",
    readingTime: 4,
    frontmatter: {
      title: "From a mountain village to IT",
      description: "How I got into software engineering.",
      date: "2026-05-03T00:00:00.000Z",
      slug: "mountain-village-to-it",
      lang: "en",
    },
  },
}

const translations = {
  en: "/blog/mountain-village-to-it/",
  ru: "/ru/blog/mountain-village-to-it/",
}

describe("Post template", () => {
  it("renders the post with its date, reading time and body", () => {
    render(
      <PostTemplate data={data} pageContext={{ lang: "en", translations }} />
    )

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "From a mountain village to IT",
      })
    ).toBeInTheDocument()
    expect(screen.getByText("May 3, 2026")).toHaveAttribute(
      "dateTime",
      "2026-05-03"
    )
    expect(screen.getByText("4 min read")).toBeInTheDocument()
    expect(screen.getByText("I grew up in Baul.")).toBeInTheDocument()
  })

  it("links the other language version and the blog", () => {
    render(
      <PostTemplate data={data} pageContext={{ lang: "en", translations }} />
    )

    const layout = screen.getByTestId("mock-layout")
    expect(layout).toHaveAttribute("data-current", "blog")
    expect(layout).toHaveAttribute("data-ru", translations.ru)
    expect(screen.getByRole("link", { name: "Русский" })).toHaveAttribute(
      "href",
      translations.ru
    )
    expect(
      screen.getAllByRole("link", { name: "All posts" })[0]
    ).toHaveAttribute("href", "/blog/")
    expect(
      screen.getByRole("link", { name: "About the author" })
    ).toHaveAttribute("href", "/")
  })

  it("falls back to the blog page when there is no translation", () => {
    render(<PostTemplate data={data} pageContext={{ lang: "ru" }} />)

    expect(screen.getByTestId("mock-layout")).toHaveAttribute(
      "data-ru",
      "/ru/blog/"
    )
    expect(screen.queryByText(/Также на/)).toBeNull()
    expect(
      screen.getAllByRole("link", { name: "Все записи" })[0]
    ).toHaveAttribute("href", "/ru/blog/")
  })

  it("passes article metadata to Seo", () => {
    render(
      <Head
        data={data}
        pageContext={{ lang: "en", translations }}
        location={{ pathname: translations.en }}
      />
    )

    const seo = screen.getByTestId("mock-seo")
    expect(seo).toHaveTextContent(
      "From a mountain village to IT | Abdillamit Mamytov"
    )
    expect(seo).toHaveAttribute("data-path", translations.en)
    expect(seo).toHaveAttribute("data-ru", translations.ru)
    expect(seo).toHaveAttribute("data-type", "article")
    expect(seo).toHaveAttribute(
      "data-description",
      "How I got into software engineering."
    )
  })
})
