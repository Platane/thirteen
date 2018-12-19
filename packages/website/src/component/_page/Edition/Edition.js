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
  preloadEntries,
}) => (
  <React.Fragment>
    <h2>{`Entries (${entries.length || '~'} in total)`}</h2>

    <EditionNav
      currentEditionSlug={currentEditionSlug}
      editions={editions}
      preloadEntries={preloadEntries}
    />

    <CategoryNav
      currentEditionSlug={currentEditionSlug}
      currentCategory={currentCategory}
      categories={categories}
    />

    <EntryList entries={entries} preloadEntry={preloadEntry} />
  </React.Fragment>
)
