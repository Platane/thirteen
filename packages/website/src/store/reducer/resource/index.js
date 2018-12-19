import { chainReducer } from '../../../util/chainReducer'
import { getFetcher } from '../../../sideEffect/staticResourceFetcher/fetchers'
import type { Entry, ID } from '../../../type'
import type { Action } from '../../../store/action/type'

export type State = {
  entryBySlug: { [string]: Entry },
  editionBySlug: { [string]: Entry },
  editions: any[] | null,
}

export const defaultState: State = {
  editionBySlug: {},
  entryBySlug: {},
  editions: null,
}

const reduceLocalStorage = (state: State, action: Action): State => {
  if (action.type === 'localStorage:read' && action.keys)
    return {
      ...state,
      ...action.keys,
    }

  return state
}

const reduceFetcher = (state: State, action: Action) => {
  state = state || defaultState

  switch (action.type) {
    case 'resource:fetcher:success':
      return getFetcher(action.resourceName).pushInCache(
        state,
        action.params,
        action.res
      )
  }

  return state
}

export const reduce = chainReducer(reduceLocalStorage, reduceFetcher)
