import query from './query/editions.graphql'

import { GRAPHQL_ENDPOINT } from '../../../config'

export const resourceName = 'editions'

export const isInCache = state => !!state.editions

export const pushInCache = (state, _, data) => {
  const editionBySlug = { ...state.editionBySlug }
  data.items.forEach(
    edition =>
      (editionBySlug[edition.slug] = {
        ...(editionBySlug[edition.slug] || {}),
        ...edition,
        categories: edition.categories.items,
        entries: (editionBySlug[edition.slug] || { entries: null }).entries,
      })
  )

  const editions = data.items.map(x => x.slug)

  return {
    ...state,
    editionBySlug,
    editions,
  }
}

export const get = ({ entrySlug }) =>
  fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query.replace(/\s+/g, ' '),
    }),
  })
    .then(res => res.json())
    .then(({ data }) => data.editions)
