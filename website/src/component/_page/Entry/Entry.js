import React from 'react'
import { Link } from '~/component/Link'

export const Entry = ({ entry }) => (
  <article className="single-entry">
    <img src={entry && entry.image.big} alt={entry && entry.title} />
    <div className="info">
      <h2>{entry && entry.title}</h2>
      <h3>{entry && entry.authors[0].name}</h3>
      <ul style={{ maxWidth: '460px' }}>
        {['twitter', 'website', 'github']
          .filter(key => entry && key in entry.authors[0])
          .map(key => (
            <li key={key} className={key}>
              <a href="/">{entry.authors[0][key]}</a>
            </li>
          ))}
      </ul>

      <Link
        href={entry && `/entry/${entry.slug}`}
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
