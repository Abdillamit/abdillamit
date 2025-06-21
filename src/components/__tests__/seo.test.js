import React from "react"
import { render } from "@testing-library/react"
import { useStaticQuery } from "gatsby"
import Seo from "../seo"

describe("SEO component", () => {
  // Стандартный мок для useStaticQuery
  const defaultMock = {
    site: {
      siteMetadata: {
        title: "Abdillamit Site",
        description: "My awesome website",
        author: "Abdillamit Developer",
      },
    },
  };
  
  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks();
    // Настраиваем мок по умолчанию
    useStaticQuery.mockImplementation(() => defaultMock);
  });

  it("renders title correctly with siteMetadata", () => {
    const { container } = render(<Seo title="Test Title" />)
    
    // Проверяем наличие правильного заголовка с названием сайта
    expect(container.querySelector("title")).toHaveTextContent("Test Title | Abdillamit Site")
  });
  
  it("renders title correctly without siteMetadata", () => {
    // Моделируем ситуацию, когда siteMetadata не содержит title
    useStaticQuery.mockImplementation(() => ({
      site: {
        siteMetadata: {}
      }
    }));
    
    const { container } = render(<Seo title="Only Title" />)
    
    // Только название страницы без названия сайта
    expect(container.querySelector("title")).toHaveTextContent("Only Title")
  });

  it("renders description meta tag correctly with custom description", () => {
    const { container } = render(<Seo title="Test Title" description="Custom Description" />)
    
    // Проверяем наличие правильного meta description
    const metaDescription = container.querySelector("meta[name='description']")
    expect(metaDescription).toHaveAttribute("content", "Custom Description")
  });

  it("uses default description when none provided", () => {
    const { container } = render(<Seo title="Test Title" />)
    
    // Проверяем, что использовалось описание по умолчанию
    const metaDescription = container.querySelector("meta[name='description']")
    expect(metaDescription).toHaveAttribute("content", "My awesome website")
  });

  it("renders title even when siteMetadata is empty", () => {
    // Моделируем ситуацию с пустыми метаданными
    useStaticQuery.mockImplementation(() => ({
      site: {
        siteMetadata: {}
      }
    }));
    
    const { container } = render(<Seo title="Test Title" />)
    
    // Проверяем только заголовок - это гарантировано работает
    expect(container.querySelector("title")).toHaveTextContent("Test Title")
    
    // Проверяем, что Twitter card существует
    expect(container.querySelector("meta[name='twitter:card']")).toHaveAttribute("content", "summary")
  });

  it("renders Open Graph and Twitter meta tags with provided data", () => {
    const { container } = render(
      <Seo title="Test Title" description="Custom Description" />
    );
    
    // Проверяем наличие Open Graph meta тегов
    expect(container.querySelector("meta[property='og:title']")).toHaveAttribute("content", "Test Title")
    expect(container.querySelector("meta[property='og:description']")).toHaveAttribute("content", "Custom Description")
    expect(container.querySelector("meta[property='og:type']")).toHaveAttribute("content", "website")
    
    // Проверяем наличие Twitter meta тегов
    expect(container.querySelector("meta[name='twitter:title']")).toHaveAttribute("content", "Test Title")
    expect(container.querySelector("meta[name='twitter:description']")).toHaveAttribute("content", "Custom Description")
    expect(container.querySelector("meta[name='twitter:creator']")).toHaveAttribute("content", "Abdillamit Developer")
  });
  
  it("renders children correctly when provided", () => {
    const { container } = render(
      <Seo title="Test Title">
        <meta name="custom-meta" content="custom-value" />
      </Seo>
    );
    
    // Проверяем, что дочерние элементы рендерятся правильно
    const customMeta = container.querySelector("meta[name='custom-meta']")
    expect(customMeta).toBeInTheDocument()
    expect(customMeta).toHaveAttribute("content", "custom-value")
  });
  
  it("uses author from siteMetadata if available", () => {
    const { container } = render(<Seo title="Test Title" />)
    
    // Проверяем, что автор взят из метаданных
    expect(container.querySelector("meta[name='twitter:creator']")).toHaveAttribute("content", "Abdillamit Developer")
  });
  
  it("uses empty string for author if not available in siteMetadata", () => {
    // Моделируем ситуацию, когда siteMetadata не содержит author
    useStaticQuery.mockImplementation(() => ({
      site: {
        siteMetadata: {
          title: "Abdillamit Site",
          description: "My awesome website"
        }
      }
    }));
    
    const { container } = render(<Seo title="Test Title" />)
    
    // Проверяем, что автор пустой
    expect(container.querySelector("meta[name='twitter:creator']")).toHaveAttribute("content", "")
  });
})
