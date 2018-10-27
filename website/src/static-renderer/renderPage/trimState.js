import {
  selectCurrentEntrySlug,
  selectCurrentEditionSlug,
} from '~/store/selector'
import { selectToFetch } from '~/sideEffect/staticResourceFetcher/required'
import type { State } from '~/store/type'

export const trimState = (state: State) => {
  const editionSlug = selectCurrentEditionSlug(state)
  const entrySlug = selectCurrentEntrySlug(state)

  if (entrySlug) {
    const { resource } = state

    const editionBySlug = {}
    resource.editions.forEach(
      slug => (editionBySlug[slug] = { categories: [], entries: null })
    )

    return {
      ...state,
      resource: {
        ...resource,
        entryBySlug: { [entrySlug]: resource.entryBySlug[entrySlug] },
        editionBySlug,
      },
    }
  }

  return state
}
