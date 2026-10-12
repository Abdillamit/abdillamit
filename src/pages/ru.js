import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import CvPage from "../components/cv-page"
import { cv } from "../data/cv"

const content = cv.ru

const RuPage = () => (
  <Layout lang={content.lang} ui={content.ui} name={content.name}>
    <CvPage content={content} />
  </Layout>
)

export const Head = () => (
  <Seo
    lang={content.lang}
    path={content.path}
    title={content.meta.title}
    description={content.meta.description}
  />
)

export default RuPage
