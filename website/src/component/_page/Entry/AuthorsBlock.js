import React from 'react'
import { Link } from '~/component/Link'

export const AuthorsBlock = ({ authors: [author] }) => (
  <React.Fragment>
    <h3>{author.name}</h3>
    <ul style={{ maxWidth: '460px' }}>
      {['twitter', 'website', 'github'].filter(key => author[key]).map(key => (
        <li key={key} className={key}>
          <a href="/">{author[key]}</a>
        </li>
      ))}
    </ul>
  </React.Fragment>
)
