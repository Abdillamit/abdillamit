import React from "react"
import { render } from "@testing-library/react"
import IndexPage, { Head } from "../index"

// Мокаем компоненты, чтобы изолировать тест IndexPage
jest.mock("../../components/layout", () => {
  return function MockLayout({ children }) {
    return <div data-testid="mock-layout">{children}</div>
  }
})

// Мокаем SEO компонент
jest.mock("../../components/seo", () => {
  return function MockSEO({ title }) {
    return <title data-testid="mock-seo">{title}</title>
  }
})

describe("IndexPage", () => {
  it("renders heading correctly", () => {
    const { getByText, getByTestId } = render(<IndexPage />)
    
    // Проверяем, что Layout используется
    expect(getByTestId("mock-layout")).toBeInTheDocument()
    
    // Проверяем, что заголовок отображается
    expect(getByText("Hello World")).toBeInTheDocument()
  })

  it("renders Head component with correct title", () => {
    const { getByTestId } = render(<Head />)
    
    // Проверяем, что SEO компонент используется с правильным заголовком
    const seo = getByTestId("mock-seo")
    expect(seo).toBeInTheDocument()
    expect(seo.textContent).toBe("Hello Abdillamit")
  })
})
