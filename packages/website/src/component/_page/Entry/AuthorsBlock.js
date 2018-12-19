import React from 'react'
import { Link } from '../../Link'

const buildUrl = (key, value) =>
  (key === 'twitter' && `https://twitter.com/${value}`) ||
  (key === 'github' && `https://github.com/${value}`) ||
  (key === 'website' && value)

export const AuthorsBlock = ({ authors: [author] }) => (
  <React.Fragment>
    <h3>{author.name || author.github || author.twitter}</h3>
    <ul style={{ maxWidth: '460px' }}>
      {['twitter', 'website', 'github']
        .filter(key => author[key])
        .map(key => (
          <li key={key} className={key}>
            <a target="_blank" href={buildUrl(key, author[key])}>
              {author[key]}
            </a>
          </li>
        ))}
    </ul>
  </React.Fragment>
)
