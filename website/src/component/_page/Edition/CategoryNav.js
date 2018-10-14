import React from 'react'
import { Link } from '~/component/Link'

export const CategoryNav = ({
  currentEditionSlug,
  currentCategory,
  categories,
}) => (
  <ul className="editions">
    <li style={{ fontWeight: !currentCategory ? 'bold' : null }}>
      <Link href={`/entries/${currentEditionSlug}`}>all</Link>
    </li>

    {categories.map(category => (
      <li
        key={category}
        style={{ fontWeight: currentCategory === category ? 'bold' : null }}
      >
        <Link href={`/entries/${currentEditionSlug}/${category}`}>
          {category}
        </Link>
      </li>
    ))}
  </ul>
)
