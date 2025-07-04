// External dependencies
import * as React from "react"

// Local dependencies
import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div
        data-testid="content-wrapper"
        style={{
          maxWidth: `var(--size-content)`,
          padding: `var(--size-gutter)`,
        }}
      >
        {children}
      </div>
    </>
  )
}

export default Layout
