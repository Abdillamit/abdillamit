import React from "react"
import { render } from "@testing-library/react"
import Layout from "../layout"
import Header from "../header"

// Мок компонента Header для изоляции тестирования Layout
jest.mock("../header", () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Mock Header</div>
  }
})

describe("Layout component", () => {
  it("renders correctly with children", () => {
    const { getByText, getByTestId } = render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    // Проверяем, что содержимое ребенка отображается
    expect(getByText("Test Content")).toBeInTheDocument()
    
    // Проверяем, что Header компонент вызывается
    expect(getByTestId("mock-header")).toBeInTheDocument()
  })
  
  it("has correct styling", () => {
    const { getByTestId } = render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    // Получаем элемент по data-testid
    const contentWrapper = getByTestId("content-wrapper")
    
    // Проверяем стили элемента
    expect(contentWrapper).toHaveAttribute(
      'style',
      expect.stringContaining('maxWidth') && expect.stringContaining('padding')
    )
  })
})
