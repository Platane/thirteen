export {
  resourceName,
  isInCache,
} from '../../graphqlResourceFetcher/fetchers/editions'
import { STATIC_ENDPOINT } from '~/config'

export const pushInCache = (state, _, data) => {
  const editionBySlug = { ...state.editionBySlug }
  data.editions.forEach(
    edition =>
      (editionBySlug[edition.slug] = {
        ...(editionBySlug[edition.slug] || {}),
        ...edition,
        entries: (editionBySlug[edition.slug] || { entries: null }).entries,
      })
  )

  const editions = data.editions.map(x => x.slug)

  return {
    ...state,
    editionBySlug,
    editions,
  }
}

export const get = () =>
  fetch(STATIC_ENDPOINT + '/index.json').then(res => res.json())
