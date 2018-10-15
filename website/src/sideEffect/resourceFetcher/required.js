import {
  selectCurrentEntrySlug,
  selectCurrentEditionSlug,
  selectCurrentCategory,
  selectFetchPending,
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
      !entrySlug &&
        editionSlug && {
          resourceName: 'entries',
          key: `entries/${editionSlug}`,
          editionSlug,
          category,
        },
    ].filter(Boolean): any)
)

const selectPreload = createSelector(
  selectFetchPending,
  (state: State) => state.fetch.preload,

  (fetchPending, preload): { resourceName: string, key: string }[] =>
    fetchPending ? [] : preload
)

export const selectToFetch = createSelector(
  selectPreload,
  selectRequired,
  (state: State) => state.resource,

  (required, preload, state) =>
    [...required, ...preload].filter(
      r => !getFetcher(r.resourceName).isInCache(state, r)
    )
)
