import * as React from "react"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import CvPage from "../../components/cv-page"
import { cv } from "../../data/cv"
import { site } from "../../data/site"
import { pageRoutes } from "../../data/routes"

const lang = "ru"

const ResumePageRu = () => (
  <Layout lang={lang} current="resume" translations={pageRoutes.resume}>
    <CvPage content={cv[lang]} />
  </Layout>
)

export const Head = () => (
  <Seo
    lang={lang}
    path={pageRoutes.resume[lang]}
    alternates={pageRoutes.resume}
    title={site[lang].meta.resume.title}
    description={site[lang].meta.resume.description}
    type="profile"
  />
)

export default ResumePageRu
