export {
  resourceName,
  isInCache,
} from '../../graphqlResourceFetcher/fetchers/entry'
import { STATIC_ENDPOINT } from '../../../config'

export const pushInCache = (state, { editionSlug }, entries) => {
  const editionBySlug = { ...state.editionBySlug }

  editionBySlug[editionSlug] = {
    ...editionBySlug[editionSlug],
    entries: entries.map(x => x.slug),
  }

  const entryBySlug = { ...state.entryBySlug }

  entries.forEach(x => {
    entryBySlug[x.slug] = entryBySlug[x.slug] || x
  })

  return {
    ...state,
    entryBySlug,
    editionBySlug,
  }
}

const flat = arr => [].concat(...arr)

export const get = async ({ editionSlug, index }) =>
  flat(
    await Promise.all(
      index[editionSlug].map(file =>
        fetch(STATIC_ENDPOINT + '/' + file).then(res => res.json())
      )
    )
  )
