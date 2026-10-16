import * as React from "react"
import { Link } from "gatsby"

import Seo from "../components/seo"
import { pageRoutes } from "../data/routes"

const NotFoundPage = () => (
  <article className="not-found">
    <h1 className="not-found__code">404</h1>
    <p>This page does not exist.</p>
    <p lang="ru">Такой страницы нет.</p>
    <p>
      <Link to={pageRoutes.about.en}>Go to the home page</Link>
      {" / "}
      <Link to={pageRoutes.about.ru} lang="ru" hrefLang="ru">
        На главную
      </Link>
    </p>
  </article>
)

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage
