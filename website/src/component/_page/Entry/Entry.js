import React from 'react'
import { Link } from '~/component/Link'

export const Entry = ({ entry }) =>
  entry && (
    <article className="entry">
      <Link href={`/${entry.slug}`}>
        <img src={entry.image.small} alt={entry.title} />
        <h3>{entry.title}</h3>
        <span>{entry.authors[0] && entry.authors[0].name}</span>
      </Link>
    </article>
  )
