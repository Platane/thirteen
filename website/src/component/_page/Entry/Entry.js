import React from 'react'
import { Link } from '~/component/Link'
import { AuthorsBlock } from './AuthorsBlock'

export const Entry = ({ entry }) => (
  <article className="single-entry">
    <img src={entry && entry.image.big} alt={entry && entry.title} />
    <div className="info">
      <h2>{entry && entry.title}</h2>

      {entry && <AuthorsBlock authors={entry.authors} />}

      <Link
        href={entry && `/entry/${entry.slug}/game`}
        target="_blank"
        className="launch"
      >
        Play the game
      </Link>
    </div>
    <div className="description">
      {entry &&
        entry.description &&
        entry.description.split('\n').map((text, i) => <p key={i}>{text}</p>)}

      <strong>{`Categories: ${entry && entry.categories.join(', ')}`}</strong>
    </div>
  </article>
)
