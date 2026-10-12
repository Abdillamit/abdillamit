import React from "react"
import { render, screen } from "@testing-library/react"
import Layout from "../layout"
import { updated } from "../../data/cv"

// Mock the header to test Layout on its own
jest.mock("../header", () => {
  return function MockHeader({ lang }) {
    return <div data-testid="mock-header">Header {lang}</div>
  }
})

describe("Layout component", () => {
  it("renders the header, children and main landmark", () => {
    render(
      <Layout lang="ru">
        <div>Test Content</div>
      </Layout>
    )

    expect(screen.getByText("Test Content")).toBeInTheDocument()
    expect(screen.getByTestId("mock-header")).toHaveTextContent("Header ru")
    expect(screen.getByRole("main")).toHaveAttribute("id", "content")
  })

  it("renders the footer with the name and update date", () => {
    render(
      <Layout ui={{ updated: "Обновлено" }} name="Abdillamit Mamytov">
        <div />
      </Layout>
    )

    const footer = screen.getByRole("contentinfo")
    expect(footer).toHaveTextContent("Abdillamit Mamytov")
    expect(footer).toHaveTextContent("Обновлено 12.10.2026")
    expect(footer.querySelector("time")).toHaveAttribute("dateTime", updated)
  })

  it("uses English defaults when no labels are passed", () => {
    render(
      <Layout>
        <div />
      </Layout>
    )

    expect(screen.getByRole("contentinfo")).toHaveTextContent("Updated")
    expect(screen.getByText("Skip to content")).toHaveAttribute(
      "href",
      "#content"
    )
  })
})
