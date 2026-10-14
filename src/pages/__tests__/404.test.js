import React from "react"
import { render, screen } from "@testing-library/react"
import NotFoundPage, { Head } from "../404"

// Isolate the page from Layout and Seo
jest.mock("../../components/layout", () => {
  return function MockLayout({ children }) {
    return <div data-testid="mock-layout">{children}</div>
  }
})

jest.mock("../../components/seo", () => {
  return function MockSEO({ title }) {
    return <title data-testid="mock-seo">{title}</title>
  }
})

describe("NotFoundPage", () => {
  it("explains the error in both languages and links to both home pages", () => {
    render(<NotFoundPage />)

    expect(screen.getByTestId("mock-layout")).toBeInTheDocument()
    expect(screen.getByText("This page does not exist.")).toBeInTheDocument()
    expect(screen.getByText("Такой страницы нет.")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Go to the home page" })
    ).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "На главную" })).toHaveAttribute(
      "href",
      "/ru/"
    )
  })

  it("renders Head with the 404 title", () => {
    render(<Head />)
    expect(screen.getByTestId("mock-seo")).toHaveTextContent("404: Not Found")
  })
})
