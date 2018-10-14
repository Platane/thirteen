import { createSelector } from 'reselect'
import type { State } from '../type'

const selectResourceState = (state: State) => state.resource

export const selectCurrentEntrySlug = (state: State) =>
  state.router.param.entrySlug1 && state.router.param.entrySlug2
    ? state.router.param.entrySlug1 + '/' + state.router.param.entrySlug2
    : null

export const selectCurrentEditionSlug = (state: State) =>
  state.router.param.editionSlug

export const selectCurrentCategory = (state: State) =>
  state.router.param.category

export const selectCurrentCardEntry = createSelector(
  selectResourceState,
  selectCurrentEntrySlug,

  ({ entryBySlug }, entrySlug) => entryBySlug[entrySlug]
)

export const selectCurrentEntry = createSelector(
  selectResourceState,
  selectCurrentEntrySlug,

  ({ entryBySlug }, entrySlug) => entryBySlug[entrySlug]
)

export const selectEditions = createSelector(
  selectResourceState,
  ({ editions }) => editions
)

export const selectCurrentEditionCategories = createSelector(
  selectResourceState,
  selectCurrentEditionSlug,

  ({ entryBySlug, editionBySlug }, editionSlug) =>
    editionBySlug[editionSlug] && editionBySlug[editionSlug].categories
)

export const selectCurrentEntries = createSelector(
  selectResourceState,
  selectCurrentEditionSlug,
  selectCurrentCategory,

  ({ entryBySlug, editionBySlug }, editionSlug, category) => {
    const edition = editionBySlug[editionSlug]

    if (!edition || !edition.entries) return null

    return edition.entries
      .map(slug => entryBySlug[slug])
      .filter(({ categories }) => !category || categories.includes(category))
  }
)
