import React from 'react'
import { EntryList } from './EntryList'
import { CategoryNav } from './CategoryNav'
import { EditionNav } from './EditionNav'

export const Edition = ({
  currentEditionSlug,
  currentCategory,
  categories,
  editions,
  entries,
  preloadEntry,
}) => (
  <React.Fragment>
    <h2>{`Entries (${entries.length || '~'} in total)`}</h2>

    <EditionNav currentEditionSlug={currentEditionSlug} editions={editions} />

    <CategoryNav
      currentEditionSlug={currentEditionSlug}
      currentCategory={currentCategory}
      categories={categories}
    />

    <EntryList entries={entries} onMouseOver={preloadEntry} />
  </React.Fragment>
)
