import React from "react"
import { render } from "@testing-library/react"
import Header from "../header"

describe("Header component", () => {
  it("renders correctly", () => {
    const { getByAltText } = render(<Header />)
    
    // Проверяем, что логотип Gatsby отображается
    expect(getByAltText("Gatsby logo")).toBeInTheDocument()
  })
  
  it("has the correct styling", () => {
    const { container } = render(<Header />)
    
    // Проверяем, что header имеет правильные стили
    const header = container.querySelector("header")
    expect(header).toHaveStyle({
      padding: "var(--space-4) var(--size-gutter)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    })
  })
})
