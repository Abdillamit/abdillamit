import React from "react"
import { render, screen } from "@testing-library/react"
import Reveal from "../reveal"

describe("Reveal", () => {
  it("renders the chosen element with the reveal class and props", () => {
    render(
      <Reveal as="section" className="split" aria-labelledby="t">
        <h2 id="t">Title</h2>
      </Reveal>
    )

    const section = screen.getByRole("region", { name: "Title" })
    expect(section.tagName).toBe("SECTION")
    expect(section).toHaveClass("reveal", "split")
  })

  it("is a div by default and starts hidden until scrolled into view", () => {
    const { container } = render(<Reveal>Text</Reveal>)

    const node = container.firstChild
    expect(node.tagName).toBe("DIV")
    expect(node).toHaveClass("reveal")
    expect(node.style.opacity).toBe("0")
  })
})
