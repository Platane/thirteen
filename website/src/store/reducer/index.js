import { combineReducers } from 'redux'
import { chainReducer } from '~/util/chainReducer'

import { reduce as router, defaultState as routerDefaultState } from './router'
import {
  reduce as resource,
  defaultState as resourceDefaultState,
} from './resource'

import type { State } from './type'

export const reduce = chainReducer(
  combineReducers({
    router,
    resource,
  })
)

export const defaultState: State = {
  router: routerDefaultState,
  resource: resourceDefaultState,
}
