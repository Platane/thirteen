import React from 'react'
import { Link } from '../../Link'

export const EditionNav = ({
  currentEditionSlug,
  editions,
  preloadEntries,
}) => (
  <ul className="editions">
    {editions.map(slug => (
      <li
        key={slug}
        onMouseOver={() => preloadEntries(slug)}
        style={{ fontWeight: currentEditionSlug === slug ? 'bold' : null }}
      >
        <Link href={`/entries/${slug}`}>{slug}</Link>
      </li>
    ))}
  </ul>
)
