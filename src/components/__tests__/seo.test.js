import React from "react"
import { render } from "@testing-library/react"
import { useStaticQuery } from "gatsby"
import Seo from "../seo"

describe("SEO component", () => {
  const defaultMock = {
    site: {
      siteMetadata: {
        title: "Abdillamit Mamytov",
        description: "Default description",
        author: "Abdillamit Mamytov",
        siteUrl: "https://example.com/",
      },
    },
  }

  let consoleError

  beforeEach(() => {
    jest.clearAllMocks()
    useStaticQuery.mockImplementation(() => defaultMock)
    // <html> inside a test <div> triggers a DOM nesting warning in React
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  it("renders the page title as given", () => {
    const { container } = render(<Seo title="Test Title" />)
    expect(container.querySelector("title")).toHaveTextContent("Test Title")
  })

  it("falls back to the site title", () => {
    const { container } = render(<Seo />)
    expect(container.querySelector("title")).toHaveTextContent(
      "Abdillamit Mamytov"
    )
  })

  it("uses the given description or the default one", () => {
    const { container, rerender } = render(
      <Seo title="T" description="Custom Description" />
    )
    expect(
      container.querySelector("meta[name='description']")
    ).toHaveAttribute("content", "Custom Description")

    rerender(<Seo title="T" />)
    expect(
      container.querySelector("meta[name='description']")
    ).toHaveAttribute("content", "Default description")
  })

  it("sets the html language", () => {
    const { container } = render(<Seo title="T" lang="ru" path="/ru/" />)
    expect(container.querySelector("html")).toHaveAttribute("lang", "ru")
    expect(
      container.querySelector("meta[property='og:locale']")
    ).toHaveAttribute("content", "ru_RU")
  })

  it("links the canonical URL and both language versions", () => {
    const { container } = render(<Seo title="T" lang="ru" path="/ru/" />)

    expect(container.querySelector("link[rel='canonical']")).toHaveAttribute(
      "href",
      "https://example.com/ru/"
    )
    expect(
      container.querySelector("link[hreflang='en']")
    ).toHaveAttribute("href", "https://example.com/")
    expect(
      container.querySelector("link[hreflang='ru']")
    ).toHaveAttribute("href", "https://example.com/ru/")
    expect(
      container.querySelector("link[hreflang='x-default']")
    ).toHaveAttribute("href", "https://example.com/")
  })

  it("skips URL tags when siteUrl is missing", () => {
    useStaticQuery.mockImplementation(() => ({ site: { siteMetadata: {} } }))
    const { container } = render(<Seo title="T" />)

    expect(container.querySelector("link[rel='canonical']")).toBeNull()
    expect(container.querySelector("meta[name='author']")).toHaveAttribute(
      "content",
      ""
    )
  })

  it("renders Open Graph and Twitter tags", () => {
    const { container } = render(
      <Seo title="Test Title" description="Custom Description" />
    )

    expect(
      container.querySelector("meta[property='og:title']")
    ).toHaveAttribute("content", "Test Title")
    expect(
      container.querySelector("meta[property='og:type']")
    ).toHaveAttribute("content", "profile")
    expect(
      container.querySelector("meta[property='og:locale']")
    ).toHaveAttribute("content", "en_US")
    expect(
      container.querySelector("meta[name='twitter:card']")
    ).toHaveAttribute("content", "summary")
    expect(
      container.querySelector("meta[name='twitter:description']")
    ).toHaveAttribute("content", "Custom Description")
  })

  it("renders children", () => {
    const { container } = render(
      <Seo title="T">
        <meta name="custom-meta" content="custom-value" />
      </Seo>
    )
    expect(container.querySelector("meta[name='custom-meta']")).toHaveAttribute(
      "content",
      "custom-value"
    )
  })
})
