import React from 'react'

import { EntryList } from '../Edition/EntryList'

const EmptySearchHint = () => <h3 style={hintStyle}>Type a search term</h3>

const NoResultHint = () => (
  <h3 style={hintStyle}>
    No match
    <br />
    :(
  </h3>
)

const hintStyle = {
  margin: '32px',
}

export const Search = ({ searchParam, entries, setQuery }) => (
  <div>
    <input
      type="search"
      placeholder="Entry name, edition, author ..."
      style={inputStyle}
      value={searchParam.query}
      onChange={e => setQuery(e.target.value)}
    />

    {searchParam.query && entries.length === 0 && <NoResultHint />}

    {!searchParam.query && <EmptySearchHint />}

    <EntryList entries={entries.slice(0, 20)} preloadEntry={() => 0} />
  </div>
)

const inputStyle = {
  width: 'calc( 100% - 64px )',
  padding: '10px',
  margin: '32px',
}
