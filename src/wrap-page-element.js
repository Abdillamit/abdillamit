import * as React from "react"

import Layout from "./components/layout"
import { layoutProps } from "./data/routes"

// Wraps every page in the site layout. Because the layout sits outside
// the page, React keeps it mounted between pages: the header does not
// re-render from scratch, so the section underline and the language
// pill can slide to their new place.
// See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/#wrapPageElement
const wrapPageElement = ({ element, props }) => (
  <Layout {...layoutProps(props.location?.pathname, props.pageContext)}>
    {element}
  </Layout>
)

export default wrapPageElement
