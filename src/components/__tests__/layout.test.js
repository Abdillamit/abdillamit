import React from "react"
import { render, screen } from "@testing-library/react"
import Layout from "../layout"

// Mock the header to test Layout on its own
jest.mock("../header", () => {
  return function MockHeader({ lang, current, translations }) {
    return (
      <div
        data-testid="mock-header"
        data-current={current}
        data-ru={translations?.ru}
      >
        Header {lang}
      </div>
    )
  }
})

describe("Layout component", () => {
  it("renders the header, children and main landmark", () => {
    render(
      <Layout lang="ru" current="blog" translations={{ ru: "/ru/blog/" }}>
        <div>Test Content</div>
      </Layout>
    )

    expect(screen.getByText("Test Content")).toBeInTheDocument()
    const header = screen.getByTestId("mock-header")
    expect(header).toHaveTextContent("Header ru")
    expect(header).toHaveAttribute("data-current", "blog")
    expect(header).toHaveAttribute("data-ru", "/ru/blog/")
    expect(screen.getByRole("main")).toHaveAttribute("id", "content")
    expect(screen.getByText("Перейти к содержанию")).toHaveAttribute(
      "href",
      "#content"
    )
  })

  it("uses English by default", () => {
    render(
      <Layout>
        <div />
      </Layout>
    )

    expect(screen.getByText("Skip to content")).toHaveAttribute(
      "href",
      "#content"
    )
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Colophon")
  })
})
