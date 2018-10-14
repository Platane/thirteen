import React from 'react'
import { Link } from '~/component/Link'

const Entry = ({ entry }) => (
  <article className="entry">
    <Link href={`/entry/${entry.slug}`}>
      <img src={entry.image.small} alt={entry.title} />
      <h3>{entry.title}</h3>
      <span>{entry.authors[0] && entry.authors[0].name}</span>
    </Link>
  </article>
)

export const EntryList = ({ entries }) => (
  <section id="entries">
    {entries.map(entry => (
      <Entry key={entry.slug} entry={entry} />
    ))}
  </section>
)
