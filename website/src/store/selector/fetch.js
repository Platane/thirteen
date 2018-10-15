import { createSelector } from 'reselect'
import type { State } from '../type'

const selectFetch = (state: State) => state.fetch

export const selectFetchPending = createSelector(
  selectFetch,

  ({ pending }) => pending.length > 0
)
