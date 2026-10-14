import React from "react"
import { render, screen, within } from "@testing-library/react"
import AboutPage from "../about-page"
import { site } from "../../data/site"

const post = {
  title: "From a mountain village to IT",
  description: "How I got into software engineering.",
  date: "2026-05-03",
  slug: "mountain-village-to-it",
  timeToRead: 4,
}

describe("AboutPage", () => {
  it("shows the name, intro and contact links", () => {
    render(<AboutPage lang="en" latestPost={post} />)

    expect(
      screen.getByRole("heading", { level: 1, name: "Abdillamit Mamytov" })
    ).toBeInTheDocument()
    expect(screen.getByText(site.en.about.lede)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/Abdillamit"
    )
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:abdillamit08@gmail.com"
    )
  })

  it("renders every step of the journey in order", () => {
    render(<AboutPage lang="en" />)

    const journey = screen.getByRole("region", { name: "Journey" })
    const titles = within(journey)
      .getAllByRole("heading", { level: 3 })
      .map(node => node.textContent)
    expect(titles).toEqual(site.en.about.journey.map(step => step.title))
  })

  it("lists current work and links to the resume", () => {
    render(<AboutPage lang="en" />)

    const work = screen.getByRole("region", { name: "What I work on" })
    site.en.about.work.forEach(item => {
      expect(within(work).getByText(`${item.name}:`)).toBeInTheDocument()
    })
    expect(
      within(work).getByRole("link", { name: "Open the resume" })
    ).toHaveAttribute("href", "/resume/")
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
      within(latest).getByRole("link", { name: "All posts" })
    ).toHaveAttribute("href", "/blog/")
  })

  it("is translated and links Russian pages", () => {
    render(<AboutPage lang="ru" latestPost={post} />)

    expect(screen.getByRole("region", { name: "Путь" })).toBeInTheDocument()
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

    expect(screen.getByRole("link", { name: "All posts" })).toBeInTheDocument()
    expect(screen.queryByRole("article")).toBeNull()
  })
})
