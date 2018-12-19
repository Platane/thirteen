import React from 'react'
import { connect } from 'react-redux'
import { App as SimpleApp } from './App'

import type { State } from '../../../store/type'

export const App = connect((state: State) => ({ routerKey: state.router.key }))(
  SimpleApp
)
