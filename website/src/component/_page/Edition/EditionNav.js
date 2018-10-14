import React from 'react'
import { Link } from '~/component/Link'

export const EditionNav = ({ currentEditionSlug, editions }) => (
  <ul className="editions">
    {editions.map(slug => (
      <li
        key={slug}
        style={{ fontWeight: currentEditionSlug === slug ? 'bold' : null }}
      >
        <Link href={`/entries/${slug}`}>{slug}</Link>
      </li>
    ))}
  </ul>
)
