import React from "react"
import { render, screen } from "@testing-library/react"
import IndexPage, { Head } from "../index"
import RuPage, { Head as RuHead } from "../ru"

// Isolate the pages from Layout and Seo
jest.mock("../../components/layout", () => {
  return function MockLayout({ lang, children }) {
    return (
      <div data-testid="mock-layout" data-lang={lang}>
        {children}
      </div>
    )
  }
})

jest.mock("../../components/seo", () => {
  return function MockSEO({ title, lang, path }) {
    return (
      <title data-testid="mock-seo" data-lang={lang} data-path={path}>
        {title}
      </title>
    )
  }
})

describe("English page", () => {
  it("renders the CV in English", () => {
    render(<IndexPage />)

    expect(screen.getByTestId("mock-layout")).toHaveAttribute("data-lang", "en")
    expect(screen.getByRole("heading", { level: 2, name: "Experience" })).toBeInTheDocument()
  })

  it("passes English metadata to Seo", () => {
    render(<Head />)

    const seo = screen.getByTestId("mock-seo")
    expect(seo).toHaveTextContent("Abdillamit Mamytov, Full Stack Software Engineer")
    expect(seo).toHaveAttribute("data-lang", "en")
    expect(seo).toHaveAttribute("data-path", "/")
  })
})

describe("Russian page", () => {
  it("renders the CV in Russian", () => {
    render(<RuPage />)

    expect(screen.getByTestId("mock-layout")).toHaveAttribute("data-lang", "ru")
    expect(screen.getByRole("heading", { level: 2, name: "Опыт работы" })).toBeInTheDocument()
  })

  it("passes Russian metadata to Seo", () => {
    render(<RuHead />)

    const seo = screen.getByTestId("mock-seo")
    expect(seo).toHaveAttribute("data-lang", "ru")
    expect(seo).toHaveAttribute("data-path", "/ru/")
  })
})
