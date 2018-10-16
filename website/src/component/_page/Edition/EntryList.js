import React from 'react'
import { Link } from '~/component/Link'

const Entry = ({ entry, onMouseOver }) => (
  <article className="entry" onMouseOver={onMouseOver}>
    <Link href={`/entry/${entry.slug}`}>
      <img src={entry.image.small} alt={entry.title} />
      <h3>{entry.title}</h3>
      <span>{entry.authors[0] && entry.authors[0].name}</span>
    </Link>
  </article>
)

export const EntryList = ({ entries, preloadEntry }) => (
  <section id="entries">
    {entries.map(entry => (
      <Entry
        key={entry.slug}
        entry={entry}
        onMouseOver={() => preloadEntry(entry.slug)}
      />
    ))}
  </section>
)
