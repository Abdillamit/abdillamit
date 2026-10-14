import React from "react"
import { render, screen, within } from "@testing-library/react"
import Header from "../header"

describe("Header component", () => {
  it("links the name and every section in English", () => {
    render(<Header lang="en" current="resume" />)

    expect(
      screen.getByRole("link", { name: "Abdillamit Mamytov" })
    ).toHaveAttribute("href", "/")

    const nav = screen.getByRole("navigation", { name: "Site sections" })
    expect(within(nav).getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/"
    )
    expect(within(nav).getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/blog/"
    )
  })

  it("marks the current section", () => {
    render(<Header lang="en" current="resume" />)

    expect(screen.getByRole("link", { name: "Resume" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(screen.getByRole("link", { name: "Blog" })).not.toHaveAttribute(
      "aria-current"
    )
  })

  it("switches to the same page in the other language", () => {
    render(
      <Header
        lang="en"
        current="resume"
        translations={{ en: "/resume/", ru: "/ru/resume/" }}
      />
    )

    const current = screen.getByText("EN")
    expect(current.tagName).toBe("SPAN")
    expect(current).toHaveAttribute("aria-current", "true")

    const other = screen.getByRole("link", { name: "RU" })
    expect(other).toHaveAttribute("href", "/ru/resume/")
    expect(other).toHaveAttribute("hrefLang", "ru")
    expect(other).toHaveAttribute("title", "Русский")
  })

  it("uses Russian labels and links on Russian pages", () => {
    render(<Header lang="ru" current="blog" />)

    const nav = screen.getByRole("navigation", { name: "Разделы сайта" })
    expect(within(nav).getByRole("link", { name: "Блог" })).toHaveAttribute(
      "href",
      "/ru/blog/"
    )
    expect(screen.getByText("RU")).toHaveAttribute("aria-current", "true")
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/"
    )
  })

  it("falls back to English and the home pages", () => {
    render(<Header />)

    expect(
      screen.getByRole("navigation", { name: "Site sections" })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "RU" })).toHaveAttribute(
      "href",
      "/ru/"
    )
  })
})
