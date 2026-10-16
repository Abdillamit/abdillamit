/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 *
 * The <html lang> attribute is set per page by the Seo component,
 * so "/" is served as English and "/ru/" as Russian.
 * The layout wrapper must match gatsby-browser.js, or hydration fails.
 */

import * as React from "react"

import wrapPageElement from "./src/wrap-page-element"

export { wrapPageElement }

// Sections that fade in on scroll start hidden. Without JavaScript they
// would stay hidden, so show them right away.
export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <noscript key="reveal-without-js">
      <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
    </noscript>,
  ])
}
