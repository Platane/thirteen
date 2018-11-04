import { connect } from 'react-redux'
import React from 'react'

import { goTo } from '~/store/action/router'

type Props = {
  href: string,
  goTo: (pathname: string, query?: Object, hash?: Object) => void,
  replace?: boolean,
  external?: boolean,
  children: *,
}

const isExternal = href => !!href.match(/^(https?:)?\/\//)

const SimpleLink = ({
  href,
  external,
  goTo,
  children,
  replace,
  ...props
}: Props) => (
  <a
    {...props}
    href={href}
    onClick={e => {
      if (external || isExternal(href)) return

      e.preventDefault()
      goTo(href)
    }}
  >
    {children}
  </a>
)

export const Link = connect(
  null,
  { goTo }
)(SimpleLink)
