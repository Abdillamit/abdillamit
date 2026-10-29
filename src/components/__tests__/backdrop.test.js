import React from "react"
import { render } from "@testing-library/react"
import Backdrop from "../backdrop"

describe("Backdrop", () => {
  it("keeps the still dot pattern without WebGL", () => {
    const { container } = render(
      <Backdrop name="faulty-terminal" className="hero__backdrop" />
    )

    const backdrop = container.firstChild
    expect(backdrop).toHaveClass("backdrop", "hero__backdrop")
    expect(backdrop).not.toHaveClass("is-live")
    expect(backdrop).toHaveAttribute("aria-hidden", "true")
    expect(backdrop).toBeEmptyDOMElement()
  })

  it("ignores names it does not know", () => {
    const { container } = render(<Backdrop name="unknown" />)
    expect(container.firstChild).toHaveClass("backdrop")
  })
})
