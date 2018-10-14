import query from './query/entries.graphql'
import fragment from './query/cardEntry.fragment.graphql'

import { GRAPHQL_ENDPOINT } from '~/config'

export const resourceName = 'entries'

export const isInCache = (state, { editionSlug }) =>
  !!(
    state.editionBySlug[editionSlug] && state.editionBySlug[editionSlug].entries
  )

export const pushInCache = (state, { editionSlug }, entries) => {
  const editionBySlug = { ...state.editionBySlug }

  editionBySlug[editionSlug] = {
    ...editionBySlug[editionSlug],
    entries: entries.items.map(x => x.slug),
  }

  const entryBySlug = { ...state.entryBySlug }

  entries.items.forEach(x => (entryBySlug[x.slug] = x))

  return {
    ...state,
    entryBySlug,
    editionBySlug,
  }
}

export const get = ({ editionSlug, category }) =>
  fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: [fragment, query].join('\n').replace(/\s+/g, ' '),
      variables: {
        editions: editionSlug ? [editionSlug] : undefined,
        // categories: category ? [category] : undefined,
      },
    }),
  })
    .then(res => res.json())
    .then(({ data }) => data.entries)
