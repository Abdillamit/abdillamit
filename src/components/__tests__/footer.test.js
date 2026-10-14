import React from "react"
import { render, screen } from "@testing-library/react"
import Footer from "../footer"

describe("Footer component", () => {
  it("credits Claude Code and links the source code", () => {
    render(<Footer lang="en" />)

    const footer = screen.getByRole("contentinfo")
    expect(footer).toHaveTextContent("Colophon")
    expect(footer).toHaveTextContent(
      "I built it together with Claude Code. The source code is on GitHub."
    )
    expect(screen.getByRole("link", { name: "Claude Code" })).toHaveAttribute(
      "href",
      "https://claude.com/claude-code"
    )
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/Abdillamit/abdillamit"
    )
  })

  it("lists the contacts", () => {
    render(<Footer />)

    expect(
      screen.getByRole("link", { name: "abdillamit08@gmail.com" })
    ).toHaveAttribute("href", "mailto:abdillamit08@gmail.com")
    expect(
      screen.getByRole("link", { name: "linkedin.com/in/abdillamit-mamytov" })
    ).toHaveAttribute("href", "https://www.linkedin.com/in/abdillamit-mamytov")
    expect(
      screen.getByText(/© 2026 Abdillamit Mamytov, Bishkek/)
    ).toBeInTheDocument()
  })

  it("is translated on Russian pages", () => {
    render(<Footer lang="ru" />)

    const footer = screen.getByRole("contentinfo")
    expect(footer).toHaveTextContent("Колофон")
    expect(footer).toHaveTextContent("Код сайта я написал вместе с Claude Code")
    expect(footer).toHaveTextContent("Бишкек")
  })
})
