import { createSelector } from 'reselect'
import { textMatch } from '../../util/textMatch'
import type { State } from '../type'

const selectQuery = (state: State) => state.router.query

const selectResourceState = (state: State) => state.resource

const ensureArray = arr => (Array.isArray(arr) ? arr : [arr])

export const selectSearchParam = createSelector(
  selectQuery,
  ({ query, category, edition }) => ({
    query: ensureArray(query)[0] || '',
    category: category ? ensureArray(category) : null,
    edition: edition ? ensureArray(edition) : null,
  })
)

export const selectSearchResult = createSelector(
  selectResourceState,
  selectSearchParam,
  ({ entryBySlug }, { query, category, edition }) =>
    Object.values(entryBySlug).filter(entry => {
      if (category && category.every(c => !entry.categories.includes(c)))
        return false

      if (edition && edition.every(c => !entry.startsWith(edition)))
        return false

      const text = [
        entry.title,
        entry.slug.split('/')[0],
        ...entry.authors.map(({ name }) => name),
        ...entry.categories,
      ].join(' ')

      return textMatch(query, text)
    })
)
