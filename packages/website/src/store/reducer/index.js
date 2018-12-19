import { combineReducers } from 'redux'
import { chainReducer } from '../../util/chainReducer'

import { reduce as fetch, defaultState as fetchDefaultState } from './fetch'
import { reduce as router, defaultState as routerDefaultState } from './router'
import {
  reduce as resource,
  defaultState as resourceDefaultState,
} from './resource'

import type { State } from './type'

export const reduce = chainReducer(
  combineReducers({
    fetch,
    router,
    resource,
  })
)

export const defaultState: State = {
  fetch: fetchDefaultState,
  router: routerDefaultState,
  resource: resourceDefaultState,
}
