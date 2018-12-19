import React from 'react'

import { Home } from '../_page/Home'
import { Entry } from '../_page/Entry'
import { Edition } from '../_page/Edition'
import { Search } from '../_page/Search'
import { Layout } from '../Layout'

export const App = (props: { routerKey: string }) => (
  <Layout title="HTML5 and JavaScript Game Development Competition in just 13 kB">
    <Content {...props} />
  </Layout>
)

const Content = ({ routerKey }) => {
  switch (routerKey) {
    case 'home':
      return <Home />

    case 'entry':
      return <Entry />

    case 'edition':
      return <Edition />

    case 'search':
      return <Search />

    default:
      return <FourOFour />
  }
}

const FourOFour = () => <span>404</span>
