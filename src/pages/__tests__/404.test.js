import React from "react"
import { render } from "@testing-library/react"
import NotFoundPage, { Head } from "../404"

// Мокаем компоненты, чтобы изолировать тест NotFoundPage
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

describe("NotFoundPage", () => {
  it("renders not found content correctly", () => {
    const { getByText, getByTestId } = render(<NotFoundPage />)
    
    // Проверяем, что Layout используется
    expect(getByTestId("mock-layout")).toBeInTheDocument()
    
    // Проверяем, что заголовок 404 отображается
    expect(getByText("404: Not Found")).toBeInTheDocument()
    
    // Проверяем, что текст ошибки отображается
    expect(getByText("You just hit a route that doesn't exist... the sadness.")).toBeInTheDocument()
  })

  it("renders Head component with correct title", () => {
    const { getByTestId } = render(<Head />)
    
    // Проверяем, что SEO компонент используется с правильным заголовком
    const seo = getByTestId("mock-seo")
    expect(seo).toBeInTheDocument()
    expect(seo.textContent).toBe("404: Not Found")
  })
})
