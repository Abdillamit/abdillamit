import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
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

  it("opens and closes the terminal from the keyboard and the footer", async () => {
    render(
      <Layout lang="en" pathname="/">
        <input aria-label="Search" />
      </Layout>
    )
    const terminal = () => screen.queryByRole("dialog", { name: "Terminal" })
    const closed = () => waitFor(() => expect(terminal()).toBeNull())

    fireEvent.keyDown(document.body, { code: "Backquote", key: "`" })
    expect(terminal()).not.toBeNull()
    fireEvent.keyDown(document.body, { code: "Escape", key: "Escape" })
    await closed()

    fireEvent.keyDown(document.body, { code: "KeyK", key: "k", ctrlKey: true })
    expect(terminal()).not.toBeNull()
    fireEvent.keyDown(document.body, { code: "KeyK", key: "k", ctrlKey: true })
    await closed()

    // ~ typed into a text field stays in the field
    fireEvent.keyDown(screen.getByLabelText("Search"), {
      code: "Backquote",
      key: "`",
    })
    expect(terminal()).toBeNull()

    const button = screen.getByRole("button", { name: "open it" })
    button.focus()
    fireEvent.click(button)
    expect(terminal()).not.toBeNull()
    fireEvent.click(screen.getByRole("button", { name: "Close the terminal" }))
    await closed()
    expect(document.activeElement).toBe(button)
  })
})
