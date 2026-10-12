import React from "react"
import { render, screen, within } from "@testing-library/react"
import CvPage from "../cv-page"
import { formatMonth } from "../period"
import { formatDay } from "../format-day"
import { cv } from "../../data/cv"

describe("CvPage", () => {
  it("renders the name, role and contacts", () => {
    render(<CvPage content={cv.en} />)

    expect(
      screen.getByRole("heading", { level: 1, name: "Abdillamit Mamytov" })
    ).toBeInTheDocument()
    expect(screen.getByText("Full Stack Software Engineer", { selector: ".cv-role span" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "github.com/Abdillamit" })).toHaveAttribute(
      "href",
      "https://github.com/Abdillamit"
    )
  })

  it("renders every section heading in English", () => {
    render(<CvPage content={cv.en} />)

    Object.values(cv.en.headings).forEach(title => {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeInTheDocument()
    })
  })

  it("renders every job, project and course", () => {
    render(<CvPage content={cv.ru} />)

    const experience = screen.getByRole("region", { name: "Опыт работы" })
    cv.ru.experience.forEach(job => {
      expect(within(experience).getAllByText(job.org).length).toBeGreaterThan(0)
    })

    const projects = screen.getByRole("region", { name: "Проекты в Mancho Devs" })
    cv.ru.projects.forEach(project => {
      expect(within(projects).getByText(project.name)).toBeInTheDocument()
    })

    const education = screen.getByRole("region", { name: "Образование и курсы" })
    cv.ru.education.forEach(course => {
      expect(within(education).getByText(course.org)).toBeInTheDocument()
    })
  })

  it("writes current roles as present and keeps machine-readable dates", () => {
    const { container } = render(<CvPage content={cv.en} />)

    const periods = [...container.querySelectorAll(".period")].map(
      node => node.textContent
    )
    expect(periods.filter(text => text === "09.2024 – present")).toHaveLength(2)
    expect(container.querySelector("time[datetime='2023-03']")).toHaveTextContent(
      "03.2023"
    )
  })

  it("uses the Russian label for a current role", () => {
    const { container } = render(<CvPage content={cv.ru} />)
    const periods = [...container.querySelectorAll(".period")].map(
      node => node.textContent
    )
    expect(
      periods.filter(text => text === "09.2024 – настоящее время")
    ).toHaveLength(2)
  })
})

describe("date helpers", () => {
  it("formats months and days", () => {
    expect(formatMonth("2021-11")).toBe("11.2021")
    expect(formatDay("2026-10-12")).toBe("12.10.2026")
  })
})

describe("CV data", () => {
  it("has the same structure in both languages", () => {
    const shape = content => ({
      experience: content.experience.map(job => job.items.length),
      projects: content.projects.map(project => project.items.length),
      education: content.education.length,
      skills: content.skills.length,
      headings: Object.keys(content.headings),
      ui: Object.keys(content.ui),
    })

    expect(shape(cv.ru)).toEqual(shape(cv.en))
  })
})
