import React from "react"
import { render, screen } from "@testing-library/react"
import HeroDiorama from "../hero-diorama"

describe("HeroDiorama", () => {
  it("describes the picture and shows the still image and the pin", () => {
    const { container } = render(<HeroDiorama lang="en" />)

    const stage = screen.getByRole("img", { name: /3D model of Baul/ })
    expect(stage).toHaveClass("hero-diorama")
    expect(stage).not.toHaveClass("is-live")
    expect(container.querySelector(".hero-diorama__poster")).toHaveAttribute(
      "src",
      "/diorama/baul.webp"
    )
    expect(container.querySelector(".hero-diorama__pin")).toHaveTextContent(
      "Baul · Leylek"
    )
  })

  it("is translated on Russian pages", () => {
    const { container } = render(<HeroDiorama lang="ru" />)

    expect(
      screen.getByRole("img", { name: /3D-модель Баула/ })
    ).toBeInTheDocument()
    expect(container.querySelector(".hero-diorama__pin")).toHaveTextContent(
      "Баул · Лейлек"
    )
  })

  it("stays on the still picture with reduced motion", () => {
    window.matchMedia = jest.fn().mockReturnValue({ matches: true })
    render(<HeroDiorama lang="en" />)

    expect(screen.getByRole("img", { name: /Baul/ })).not.toHaveClass("is-live")
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(prefers-reduced-motion: reduce)"
    )
    delete window.matchMedia
  })
})
