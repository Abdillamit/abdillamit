import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import TerrainFigure from "../terrain-figure"

describe("TerrainFigure", () => {
  it("renders an empty stage and an honest caption in both languages", () => {
    const { container, rerender } = render(<TerrainFigure lang="en" />)

    expect(container.querySelector("figure .terrain-stage")).toHaveAttribute(
      "aria-hidden",
      "true"
    )
    expect(screen.getByText("Fig. 1.")).toBeInTheDocument()
    expect(screen.getByText(/The relief is stylized/)).toBeInTheDocument()

    rerender(<TerrainFigure lang="ru" />)
    expect(screen.getByText("Рис. 1.")).toBeInTheDocument()
  })

  it("leaves the figure out when WebGL is not available", async () => {
    const OriginalObserver = global.IntersectionObserver
    global.IntersectionObserver = class {
      constructor(callback) {
        this.callback = callback
      }
      observe() {
        this.callback([{ isIntersecting: true }])
      }
      disconnect() {}
    }
    const getContext = jest
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue(null)

    const { container } = render(<TerrainFigure lang="en" />)
    await waitFor(() => expect(container.querySelector("figure")).toBeNull())

    getContext.mockRestore()
    global.IntersectionObserver = OriginalObserver
  })
})
