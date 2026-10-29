import React from "react"
import { fireEvent, render, screen, within } from "@testing-library/react"
import Header from "../header"

const desktopNav = name =>
  screen
    .getAllByRole("navigation", { name })
    .find(nav => nav.classList.contains("site-nav"))

describe("Header component", () => {
  it("shows the mark, name and role, linked to the home page", () => {
    render(<Header lang="en" current="resume" />)

    const brand = screen.getByRole("link", { name: /Abdillamit Mamytov/ })
    expect(brand).toHaveAttribute("href", "/")
    expect(brand).toHaveTextContent("Full Stack Engineer · Bishkek")
    const mark = brand.querySelector(".brand-mark")
    expect(mark).toHaveAttribute("aria-hidden", "true")
    expect(mark.querySelector("svg")).not.toBeNull()
  })

  it("links GitHub with an icon", () => {
    render(<Header lang="ru" />)

    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/Abdillamit"
    )
  })

  it("links every section and marks the current one", () => {
    render(<Header lang="en" current="resume" />)

    const nav = desktopNav("Site sections")
    expect(within(nav).getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/"
    )
    expect(within(nav).getByRole("link", { name: "Resume" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(within(nav).getByRole("link", { name: "Blog" })).not.toHaveAttribute(
      "aria-current"
    )
  })

  it("moves the underline to the section under the pointer", () => {
    const { container } = render(<Header lang="en" current="about" />)
    const underlined = () =>
      container.querySelector(".nav-underline").parentElement.textContent

    expect(underlined()).toBe("About")
    fireEvent.mouseEnter(screen.getByRole("link", { name: "Blog" }))
    expect(underlined()).toBe("Blog")
    fireEvent.mouseLeave(container.querySelector(".nav-links"))
    expect(underlined()).toBe("About")
  })

  it("switches to the same page in the other language", () => {
    const { container } = render(
      <Header
        lang="en"
        current="resume"
        translations={{ en: "/resume/", ru: "/ru/resume/" }}
      />
    )

    const current = screen.getByText("EN").closest(".lang-option")
    expect(current.tagName).toBe("SPAN")
    expect(current).toHaveAttribute("aria-current", "true")
    expect(current.querySelector(".lang-pill")).not.toBeNull()
    expect(container.querySelectorAll(".lang-pill")).toHaveLength(1)

    const other = screen.getByRole("link", { name: "RU" })
    expect(other).toHaveAttribute("href", "/ru/resume/")
    expect(other).toHaveAttribute("hrefLang", "ru")
    expect(other).toHaveAttribute("title", "Русский")
  })

  it("uses Russian labels and links on Russian pages", () => {
    render(<Header lang="ru" current="blog" />)

    const nav = desktopNav("Разделы сайта")
    expect(within(nav).getByRole("link", { name: "Блог" })).toHaveAttribute(
      "href",
      "/ru/blog/"
    )
    expect(
      screen.getByRole("link", { name: /Full Stack разработчик · Бишкек/ })
    ).toHaveAttribute("href", "/ru/")
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/"
    )
  })

  it("falls back to English and the home pages", () => {
    render(<Header />)

    expect(desktopNav("Site sections")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "RU" })).toHaveAttribute(
      "href",
      "/ru/"
    )
  })
})

describe("Header menu on small screens", () => {
  it("asks the layout to open the menu", () => {
    const onMenuChange = jest.fn()
    render(<Header lang="en" onMenuChange={onMenuChange} />)

    const button = screen.getByRole("button", { name: "Menu" })
    expect(button).toHaveAttribute("aria-expanded", "false")
    expect(button).not.toHaveAttribute("aria-controls")
    fireEvent.click(button)
    expect(onMenuChange).toHaveBeenCalledWith(true)
  })

  it("shows the sections and contacts when open and moves focus in", () => {
    render(<Header lang="ru" current="resume" menuOpen />)

    const button = screen.getByRole("button", { name: "Закрыть" })
    expect(button).toHaveAttribute("aria-expanded", "true")
    expect(button).toHaveAttribute("aria-controls", "site-menu")

    const menu = document.getElementById("site-menu")
    const links = within(menu).getAllByRole("link")
    expect(links.map(link => link.getAttribute("href"))).toEqual([
      "/ru/",
      "/ru/resume/",
      "/ru/blog/",
      "mailto:abdillamit08@gmail.com",
      "https://www.linkedin.com/in/abdillamit-mamytov",
      "https://github.com/Abdillamit",
    ])
    expect(within(menu).getByRole("link", { name: "Резюме" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(document.activeElement).toBe(links[0])
  })

  it("closes with Escape and returns focus to the button", () => {
    const onMenuChange = jest.fn()
    render(<Header lang="en" menuOpen onMenuChange={onMenuChange} />)

    fireEvent.keyDown(document, { key: "Enter" })
    expect(onMenuChange).not.toHaveBeenCalled()

    fireEvent.keyDown(document, { key: "Escape" })
    expect(onMenuChange).toHaveBeenCalledWith(false)
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Close" })
    )
  })

  it("closes after a menu link is used", () => {
    const onMenuChange = jest.fn()
    render(<Header lang="en" menuOpen onMenuChange={onMenuChange} />)

    const menu = document.getElementById("site-menu")
    fireEvent.click(within(menu).getByRole("link", { name: "Blog" }))
    expect(onMenuChange).toHaveBeenCalledWith(false)
  })

  it("shows a reading progress bar only on posts", () => {
    const { container, rerender } = render(<Header lang="en" />)
    expect(container.querySelector(".read-progress")).toBeNull()

    rerender(<Header lang="en" isPost />)
    expect(container.querySelector(".read-progress")).not.toBeNull()
  })
})
