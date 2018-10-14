import React from 'react'
import { connect } from 'react-redux'
import { Entry as SimpleEntry } from './Entry'

import { selectCurrentCardEntry, selectCurrentEntry } from '~/store/selector'

import type { State } from '~/store/type'

export const Entry = connect((state: State) => ({
  cardEntry: selectCurrentCardEntry(state),
  entry: selectCurrentEntry(state),
}))(SimpleEntry)
