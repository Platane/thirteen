import { chainReducer } from '~/util/chainReducer'

import type { Action } from '~/store/action/type'

export type State = {
  pending: string[],
  preload: any[],
}

export const defaultState: State = {
  preload: [],
  pending: [],
}

const reducePending = (state: State, action: Action): State => {
  switch (action.type) {
    case 'resource:fetcher:start':
      return {
        ...state,
        pending: [...state.pending, action.key],
      }
    case 'resource:fetcher:success':
    case 'resource:fetcher:failure':
      return {
        ...state,
        pending: state.pending.filter(key => key !== action.key),
      }
  }
  return state || defaultState
}

const reducePreload = (state: State, action: Action): State => {
  switch (action.type) {
    case 'resource:fetcher:preload':
      if (state.preload.some(({ key }) => key === action.key)) break

      const { resourceName, params, key } = action
      return {
        ...state,
        preload: [{ ...params, resourceName, key }, ...state.preload].slice(
          0,
          3
        ),
      }
  }
  return state || defaultState
}

export const reduce = chainReducer(reducePending, reducePreload)
