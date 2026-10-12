import React from "react"
import { render, screen } from "@testing-library/react"
import Header from "../header"

describe("Header component", () => {
  it("marks English as current on the English page", () => {
    render(<Header lang="en" label="Language" />)

    const current = screen.getByText("English")
    expect(current.tagName).toBe("SPAN")
    expect(current).toHaveAttribute("aria-current", "page")

    const other = screen.getByRole("link", { name: "Русский" })
    expect(other).toHaveAttribute("href", "/ru/")
    expect(other).toHaveAttribute("hrefLang", "ru")
  })

  it("links back to English from the Russian page", () => {
    render(<Header lang="ru" label="Язык" />)

    expect(screen.getByRole("navigation", { name: "Язык" })).toBeInTheDocument()
    expect(screen.getByText("Русский")).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/"
    )
  })

  it("falls back to English and a default label", () => {
    render(<Header />)

    expect(
      screen.getByRole("navigation", { name: "Language" })
    ).toBeInTheDocument()
    expect(screen.getByText("English")).toHaveAttribute("aria-current", "page")
  })
})
