import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import EnvironmentInfo from "../components/environment-info"

const IndexPage = () => (
  <Layout>
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem',
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#663399'
    }}>
      <h1>Hello Abdillamit</h1>
      <p style={{ fontSize: '1.2rem', fontWeight: 'normal', marginTop: '1rem' }}>
        Welcome to your Gatsby.js site deployed on AWS!
      </p>
    </div>
    
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 1rem' }}>
      <EnvironmentInfo />
    </div>
  </Layout>
)

export const Head = () => <Seo title="Hello Abdillamit" />

export default IndexPage

