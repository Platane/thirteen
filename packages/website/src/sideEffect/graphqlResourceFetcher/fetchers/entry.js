import query from './query/entry.graphql'
import fragment from './query/fullEntry.fragment.graphql'

import { GRAPHQL_ENDPOINT } from '../../../config'

export const resourceName = 'entry'

export const isInCache = (state, { entrySlug }) =>
  !!(state.entryBySlug[entrySlug] && state.entryBySlug[entrySlug].description)

export const pushInCache = (state, { entrySlug }, res) => ({
  ...state,
  entryBySlug: {
    ...state.entryBySlug,
    [entrySlug]: res,
  },
})

export const get = ({ entrySlug }) =>
  fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: [fragment, query].join('\n').replace(/\s+/g, ' '),
      variables: { entrySlug },
    }),
  })
    .then(res => res.json())
    .then(({ data }) => data.singleEntry)
