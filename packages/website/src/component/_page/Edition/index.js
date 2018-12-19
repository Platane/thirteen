import React from 'react'
import { connect } from 'react-redux'
import { Edition as SimpleEdition } from './Edition'
import { preloadEntry, preloadEntries } from '../../../store/action'

import {
  selectEditions,
  selectCurrentEditionCategories,
  selectCurrentEntries,
  selectCurrentCategory,
  selectCurrentEditionSlug,
} from '../../../store/selector'

import type { State } from '../../../store/type'

export const Edition = connect(
  (state: State) => ({
    currentCategory: selectCurrentCategory(state),
    currentEditionSlug: selectCurrentEditionSlug(state),
    entries: selectCurrentEntries(state) || [],
    categories: selectCurrentEditionCategories(state) || [],
    editions: selectEditions(state) || [],
  }),
  { preloadEntry, preloadEntries }
)(SimpleEdition)
