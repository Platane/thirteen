import React from 'react'
import { Header } from '../Header'
import { Footer } from '../Footer'

export const Layout = ({ title, children }) => (
  <React.Fragment>
    <Header />
    <h1>{title}</h1>
    <div className="content">{children}</div>
    <Footer />
  </React.Fragment>
)
