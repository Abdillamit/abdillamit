import React from "react"
import { fireEvent, render, screen, within } from "@testing-library/react"
import AboutPage from "../about-page"
import { TerminalContext } from "../terminal-context"
import { site } from "../../data/site"

const post = {
  title: "From a mountain village to IT",
  description: "How I got into software engineering.",
  date: "2026-05-03",
  slug: "mountain-village-to-it",
  timeToRead: 4,
}

describe("AboutPage", () => {
  it("opens with the headline, intro and actions", () => {
    render(<AboutPage lang="en" latestPost={post} />)

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Abdillamit Mamytov. From a mountain village to shipping fintech.",
      })
    ).toBeInTheDocument()
    expect(screen.getByText(site.en.about.lede)).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Open the resume" })
    ).toHaveAttribute("href", "/resume/")
    screen
      .getAllByRole("link", { name: "GitHub" })
      .forEach(link =>
        expect(link).toHaveAttribute("href", "https://github.com/Abdillamit")
      )
  })

  it("has a terminal on the first screen", () => {
    render(<AboutPage lang="en" />)

    const terminal = screen.getByRole("region", { name: "Terminal" })
    expect(
      within(terminal).getByRole("button", { name: "whoami" })
    ).toBeInTheDocument()
    expect(
      within(terminal).getByRole("textbox", { name: "Type a command" })
    ).toBeInTheDocument()
  })

  it("opens the full terminal from the hint", () => {
    const open = jest.fn()
    render(
      <TerminalContext.Provider value={{ open }}>
        <AboutPage lang="en" />
      </TerminalContext.Provider>
    )

    fireEvent.click(
      screen.getByRole("button", { name: "or press ~ for the full terminal" })
    )
    expect(open).toHaveBeenCalled()
  })

  it("switches between products", () => {
    render(<AboutPage lang="en" />)

    const work = screen.getByRole("region", { name: site.en.about.workTitle })
    const tabs = within(work).getByRole("group", { name: "Products" })
    const tab = name => within(tabs).getByRole("button", { name })

    expect(tab("Finik")).toHaveAttribute("aria-pressed", "true")
    expect(
      within(work).getByRole("heading", {
        level: 3,
        name: site.en.about.products[0].title,
      })
    ).toBeInTheDocument()

    fireEvent.click(tab("SlonExpress"))
    expect(tab("SlonExpress")).toHaveAttribute("aria-pressed", "true")
    expect(tab("Finik")).toHaveAttribute("aria-pressed", "false")
    expect(
      within(work).getByRole("heading", {
        level: 3,
        name: site.en.about.products[2].title,
      })
    ).toBeInTheDocument()
    expect(within(work).getByText("Node.js on Lambda")).toBeInTheDocument()
  })

  it("selects a product from the strip under the first screen", () => {
    render(<AboutPage lang="en" />)

    const strip = screen.getByRole("region", {
      name: "Products I work on at Mancho Devs",
    })
    fireEvent.click(within(strip).getByRole("link", { name: /umrahhajj/ }))
    expect(screen.getByRole("button", { name: "umrahhajj" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
  })

  it("shows the stack as code", () => {
    render(<AboutPage lang="en" />)

    const stack = screen.getByRole("region", { name: site.en.about.stackTitle })
    expect(within(stack).getByLabelText("profile.ts")).toHaveTextContent(
      'name: "Abdillamit Mamytov"'
    )
    fireEvent.click(within(stack).getByRole("button", { name: "aws.json" }))
    expect(within(stack).getByLabelText("aws.json")).toHaveTextContent(
      "CloudWatch"
    )
  })

  it("renders every step of the journey in order", () => {
    render(<AboutPage lang="en" />)

    const journey = screen.getByRole("region", {
      name: site.en.about.journeyTitle,
    })
    const titles = within(journey)
      .getAllByRole("heading", { level: 3 })
      .map(node => node.textContent)
    expect(titles).toEqual(site.en.about.journey.map(step => step.title))
  })

  it("teases the latest post", () => {
    render(<AboutPage lang="en" latestPost={post} />)

    const latest = screen.getByRole("region", { name: "From the blog" })
    expect(
      within(latest).getByRole("link", { name: post.title })
    ).toHaveAttribute("href", "/blog/mountain-village-to-it/")
    expect(within(latest).getByText("May 3, 2026")).toHaveAttribute(
      "dateTime",
      "2026-05-03"
    )
    expect(
      within(latest).getByRole("link", { name: "All posts →" })
    ).toHaveAttribute("href", "/blog/")
    expect(
      screen.getByRole("link", { name: /New on the blog/ })
    ).toHaveAttribute("href", "/blog/mountain-village-to-it/")
  })

  it("ends with the contacts", () => {
    render(<AboutPage lang="en" />)

    const contact = screen.getByRole("region", {
      name: site.en.about.contactTitle,
    })
    expect(
      within(contact).getByRole("link", { name: "abdillamit08@gmail.com" })
    ).toHaveAttribute("href", "mailto:abdillamit08@gmail.com")
    expect(
      within(contact).getByRole("link", { name: "LinkedIn" })
    ).toHaveAttribute("href", "https://www.linkedin.com/in/abdillamit-mamytov")
  })

  it("is translated and links Russian pages", () => {
    render(<AboutPage lang="ru" latestPost={post} />)

    expect(
      screen.getByRole("heading", { level: 1, name: /Из горного села/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("region", { name: site.ru.about.journeyTitle })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Открыть резюме" })
    ).toHaveAttribute("href", "/ru/resume/")
    expect(screen.getByRole("link", { name: post.title })).toHaveAttribute(
      "href",
      "/ru/blog/mountain-village-to-it/"
    )
    expect(screen.getByText("3 мая 2026")).toBeInTheDocument()
  })

  it("works without a post", () => {
    render(<AboutPage />)

    expect(
      screen.getByRole("link", { name: "All posts →" })
    ).toBeInTheDocument()
    expect(screen.queryByRole("article")).toBeNull()
    expect(screen.queryByRole("link", { name: /New on the blog/ })).toBeNull()
  })
})
