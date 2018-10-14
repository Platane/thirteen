import {
  selectCurrentEntrySlug,
  selectCurrentEditionSlug,
  selectCurrentCategory,
} from '~/store/selector'
import { createSelector } from 'reselect'
import { getFetcher } from './fetchers'
import type { Store, State } from '~/store/type'

// select resource that need to be fetched
const selectRequired = createSelector(
  selectCurrentEntrySlug,
  selectCurrentEditionSlug,
  selectCurrentCategory,

  (entrySlug, editionSlug, category): { resourceName: string, key: string }[] =>
    ([
      // editions
      {
        resourceName: 'editions',
        key: `editions`,
      },

      // entry
      entrySlug && {
        resourceName: 'entry',
        key: `entry/${entrySlug}`,
        entrySlug,
      },

      // edition
      editionSlug && {
        resourceName: 'entries',
        key: `entries/${editionSlug}`,
        editionSlug,
        category,
      },
    ].filter(Boolean): any)
)

export const selectToFetch = createSelector(
  selectRequired,
  (state: State) => state.resource,

  (required, state) =>
    required.filter(r => !getFetcher(r.resourceName).isInCache(state, r))
)
