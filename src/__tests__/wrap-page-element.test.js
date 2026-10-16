import React from "react"
import { render, screen } from "@testing-library/react"
import wrapPageElement from "../wrap-page-element"

describe("wrapPageElement", () => {
  it("wraps the page in the layout for its URL", () => {
    render(
      wrapPageElement({
        element: <p>Page body</p>,
        props: { location: { pathname: "/ru/resume/" }, pageContext: {} },
      })
    )

    expect(screen.getByRole("main")).toHaveTextContent("Page body")
    expect(screen.getAllByRole("link", { name: "Резюме" })[0]).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/resume/"
    )
  })

  it("links a post to its translation", () => {
    render(
      wrapPageElement({
        element: <p>Post</p>,
        props: {
          location: { pathname: "/blog/a/" },
          pageContext: { translations: { en: "/blog/a/", ru: "/ru/blog/a/" } },
        },
      })
    )

    expect(screen.getByRole("link", { name: "RU" })).toHaveAttribute(
      "href",
      "/ru/blog/a/"
    )
  })
})
