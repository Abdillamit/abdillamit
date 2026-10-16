import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import Layout from "../layout"

describe("Layout component", () => {
  it("renders the header, children, main landmark and footer", () => {
    render(
      <Layout lang="ru" current="blog" pathname="/ru/blog/">
        <div>Test Content</div>
      </Layout>
    )

    expect(screen.getByText("Test Content")).toBeInTheDocument()
    expect(screen.getByRole("banner")).toBeInTheDocument()
    expect(screen.getByRole("main")).toHaveAttribute("id", "content")
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Колофон")
    expect(screen.getByText("Перейти к содержанию")).toHaveAttribute(
      "href",
      "#content"
    )
  })

  it("passes the page section and translations to the header", () => {
    render(
      <Layout
        lang="en"
        current="resume"
        translations={{ en: "/resume/", ru: "/ru/resume/" }}
      >
        <div />
      </Layout>
    )

    expect(screen.getAllByRole("link", { name: "Resume" })[0]).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(screen.getByRole("link", { name: "RU" })).toHaveAttribute(
      "href",
      "/ru/resume/"
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

  it("locks the page behind the open menu and closes it on navigation", () => {
    const { container, rerender } = render(
      <Layout lang="en" pathname="/">
        <div />
      </Layout>
    )
    const content = container.querySelector(".page-content")

    fireEvent.click(screen.getByRole("button", { name: "Menu" }))
    expect(document.getElementById("site-menu")).not.toBeNull()
    expect(content.inert).toBe(true)
    expect(document.documentElement).toHaveClass("has-menu-open")

    rerender(
      <Layout lang="en" current="blog" pathname="/blog/">
        <div />
      </Layout>
    )
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    expect(content.inert).toBe(false)
    expect(document.documentElement).not.toHaveClass("has-menu-open")
  })
})
