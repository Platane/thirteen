import {
  selectCurrentEntrySlug,
  selectCurrentEditionSlug,
} from '@thirteen/website/src/store/selector'
import { selectToFetch } from '@thirteen/website/src/sideEffect/staticResourceFetcher/required'
import type { State } from '@thirteen/website/src/store/type'

/**
 * prevent from sending a too large payload on the page
 * trim resources that are not required by the page
 */
export const trimState = (state: State) => {
  const entrySlug = selectCurrentEntrySlug(state)

  if (entrySlug) {
    const { resource } = state

    const editionBySlug = {}
    ;(resource.editions || []).forEach(slug => {
      editionBySlug[slug] = { categories: [] }
    })

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
