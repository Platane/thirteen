import {
  selectCurrentEntrySlug,
  selectCurrentEditionSlug,
} from '@thirteen/website/src/store/selector'
import { selectToFetch } from '@thirteen/website/src/sideEffect/staticResourceFetcher/required'
import type { State } from '@thirteen/website/src/store/type'

export const trimState = (state: State) => {
  const editionSlug = selectCurrentEditionSlug(state)
  const entrySlug = selectCurrentEntrySlug(state)

  if (entrySlug) {
    const { resource } = state

    const editionBySlug = {}
    ;(resource.editions || []).forEach(
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
