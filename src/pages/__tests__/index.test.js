import React from "react"
import { render, screen } from "@testing-library/react"

import AboutEn, { Head as AboutEnHead } from "../index"
import AboutRu, { Head as AboutRuHead } from "../ru/index"
import ResumeEn, { Head as ResumeEnHead } from "../resume"
import ResumeRu, { Head as ResumeRuHead } from "../ru/resume"
import BlogEn, { Head as BlogEnHead } from "../blog"
import BlogRu, { Head as BlogRuHead } from "../ru/blog"

// Isolate the pages from Layout and Seo
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
  return function MockSEO({ title, lang, path, alternates, type }) {
    return (
      <title
        data-testid="mock-seo"
        data-lang={lang}
        data-path={path}
        data-ru={alternates?.ru}
        data-type={type}
      >
        {title}
      </title>
    )
  }
})

const data = {
  allMarkdownRemark: {
    nodes: [
      {
        readingTime: 4,
        frontmatter: {
          title: "From a mountain village to IT",
          description: "How I got into software engineering.",
          date: "2026-05-03T00:00:00.000Z",
          slug: "mountain-village-to-it",
        },
      },
    ],
  },
}

const pages = [
  {
    name: "English About",
    Page: AboutEn,
    Head: AboutEnHead,
    lang: "en",
    current: "about",
    path: "/",
    ru: "/ru/",
    heading: { level: 1, name: "Abdillamit Mamytov" },
  },
  {
    name: "Russian About",
    Page: AboutRu,
    Head: AboutRuHead,
    lang: "ru",
    current: "about",
    path: "/ru/",
    ru: "/ru/",
    heading: { level: 2, name: "Путь" },
  },
  {
    name: "English Resume",
    Page: ResumeEn,
    Head: ResumeEnHead,
    lang: "en",
    current: "resume",
    path: "/resume/",
    ru: "/ru/resume/",
    heading: { level: 2, name: "Experience" },
    type: "profile",
  },
  {
    name: "Russian Resume",
    Page: ResumeRu,
    Head: ResumeRuHead,
    lang: "ru",
    current: "resume",
    path: "/ru/resume/",
    ru: "/ru/resume/",
    heading: { level: 2, name: "Опыт работы" },
    type: "profile",
  },
  {
    name: "English Blog",
    Page: BlogEn,
    Head: BlogEnHead,
    lang: "en",
    current: "blog",
    path: "/blog/",
    ru: "/ru/blog/",
    heading: { level: 1, name: "Blog" },
  },
  {
    name: "Russian Blog",
    Page: BlogRu,
    Head: BlogRuHead,
    lang: "ru",
    current: "blog",
    path: "/ru/blog/",
    ru: "/ru/blog/",
    heading: { level: 1, name: "Блог" },
  },
]

describe.each(pages)(
  "$name page",
  ({ Page, Head, lang, current, path, ru, heading, type }) => {
    it("renders inside the layout with the right section and language", () => {
      render(<Page data={data} />)

      const layout = screen.getByTestId("mock-layout")
      expect(layout).toHaveAttribute("data-lang", lang)
      expect(layout).toHaveAttribute("data-current", current)
      expect(layout).toHaveAttribute("data-ru", ru)
      expect(screen.getByRole("heading", heading)).toBeInTheDocument()
    })

    it("passes metadata to Seo", () => {
      render(<Head />)

      const seo = screen.getByTestId("mock-seo")
      expect(seo).toHaveTextContent("Abdillamit Mamytov")
      expect(seo).toHaveAttribute("data-lang", lang)
      expect(seo).toHaveAttribute("data-path", path)
      expect(seo).toHaveAttribute("data-ru", ru)
      if (type) expect(seo).toHaveAttribute("data-type", type)
    })
  }
)

it("shows the latest post on the About page", () => {
  render(<AboutEn data={data} />)

  expect(
    screen.getByRole("link", { name: "From a mountain village to IT" })
  ).toHaveAttribute("href", "/blog/mountain-village-to-it/")
})
