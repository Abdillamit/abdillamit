import * as React from "react"

import Seo from "../components/seo"
import CvPage from "../components/cv-page"
import { cv } from "../data/cv"
import { site } from "../data/site"
import { pageRoutes } from "../data/routes"

const lang = "en"

const ResumePageEn = () => <CvPage content={cv[lang]} />

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

export default ResumePageEn
