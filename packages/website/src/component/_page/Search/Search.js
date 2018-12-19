import React from 'react'

export const Search = ({ searchParam, entries, setQuery }) => (
  <div>
    <input
      type="text"
      value={searchParam.query}
      onChange={e => setQuery(e.target.value)}
    />

    <pre>{JSON.stringify(searchParam, null, 2)}</pre>

    <ul>
      {entries.slice(0, 20).map(entry => (
        <li key={entry.slug} style={oneLine}>
          {entry.slug} - {entry.title}
        </li>
      ))}
    </ul>
  </div>
)

const oneLine = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  marginBottom: '4px',
}
