import React from 'react'
import { connect } from 'react-redux'
import { Entry as SimpleEntry } from './Entry'

import { selectCurrentEntry } from '../../../store/selector'

import type { State } from '../../../store/type'

export const Entry = connect((state: State) => ({
  entry: selectCurrentEntry(state),
}))(SimpleEntry)
