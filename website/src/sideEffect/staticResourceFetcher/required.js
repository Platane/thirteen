import {
  selectCurrentEntrySlug,
  selectCurrentEditionSlug,
  selectCurrentCategory,
  selectFetchPending,
} from '~/store/selector'
import { createSelector } from 'reselect'
import { getFetcher } from './fetchers'
import type { Store, State } from '~/store/type'

const selectIndex = (state: State) => state.fetch.index

// select resource that need to be fetched
const selectRequired = createSelector(
  selectCurrentEditionSlug,
  selectIndex,

  (editionSlug, index): { resourceName: string, key: string }[] =>
    ([
      // editions
      {
        resourceName: 'editions',
        key: `editions`,
      },

      // edition
      editionSlug &&
        index && {
          resourceName: 'entries',
          key: `entries/${editionSlug}`,
          editionSlug,
          index,
        },
    ].filter(Boolean): any)
)

const selectPreload = createSelector(
  selectFetchPending,
  (state: State) => state.fetch.preload,

  (fetchPending, preload): { resourceName: string, key: string }[] =>
    fetchPending || true ? [] : preload
)

export const selectToFetch = createSelector(
  selectRequired,
  selectPreload,
  (state: State) => state.resource,

  (required, preload, state) =>
    [...required, ...preload].filter(
      r => !getFetcher(r.resourceName).isInCache(state, r)
    )
)
