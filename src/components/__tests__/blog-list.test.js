import React from "react"
import { render, screen, within } from "@testing-library/react"
import BlogList, { groupByYear } from "../blog-list"

const posts = [
  {
    title: "Newest",
    description: "Second post",
    date: "2027-01-10",
    slug: "newest",
    timeToRead: 2,
  },
  {
    title: "From a mountain village to IT",
    description: "First post",
    date: "2026-05-03",
    slug: "mountain-village-to-it",
    timeToRead: 4,
  },
  {
    title: "Older",
    description: "Without reading time",
    date: "2026-02-01",
    slug: "older",
  },
]

describe("groupByYear", () => {
  it("keeps the order and groups posts by year", () => {
    expect(
      groupByYear(posts).map(group => [
        group.year,
        group.posts.map(post => post.slug),
      ])
    ).toEqual([
      ["2027", ["newest"]],
      ["2026", ["mountain-village-to-it", "older"]],
    ])
  })
})

describe("BlogList", () => {
  it("renders the title and a section per year", () => {
    render(<BlogList lang="en" posts={posts} />)

    expect(
      screen.getByRole("heading", { level: 1, name: "Blog" })
    ).toBeInTheDocument()
    const year = screen.getByRole("region", { name: "2026" })
    expect(within(year).getAllByRole("article")).toHaveLength(2)
  })

  it("links every post with its date and reading time", () => {
    const { container } = render(<BlogList lang="en" posts={posts} />)

    expect(
      screen.getByRole("link", { name: "From a mountain village to IT" })
    ).toHaveAttribute("href", "/blog/mountain-village-to-it/")
    const dates = [...container.querySelectorAll(".post-date")].map(
      node => node.textContent
    )
    expect(dates).toEqual([
      "January 10, 2027 · 2 min read",
      "May 3, 2026 · 4 min read",
      "February 1, 2026",
    ])
    expect(screen.getByText("May 3, 2026")).toHaveAttribute(
      "dateTime",
      "2026-05-03"
    )
  })

  it("points readers to LinkedIn for new posts", () => {
    render(<BlogList lang="ru" posts={posts} />)

    expect(screen.getByRole("link", { name: "Newest" })).toHaveAttribute(
      "href",
      "/ru/blog/newest/"
    )
    const next = screen.getByRole("region", { name: "Дальше" })
    expect(
      within(next).getByRole("link", { name: "LinkedIn" })
    ).toHaveAttribute("href", "https://www.linkedin.com/in/abdillamit-mamytov")
  })

  it("renders without posts", () => {
    render(<BlogList />)
    expect(screen.queryAllByRole("article")).toHaveLength(0)
  })
})
