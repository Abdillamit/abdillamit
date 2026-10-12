import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <article className="not-found">
      <h1 className="cv-name">404</h1>
      <p>This page does not exist.</p>
      <p lang="ru">Такой страницы нет.</p>
      <p>
        <Link to="/">Open the CV</Link>
        {" / "}
        <Link to="/ru/" lang="ru" hrefLang="ru">
          Открыть резюме
        </Link>
      </p>
    </article>
  </Layout>
)

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage
