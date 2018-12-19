import type { State as routerState } from './router'
import type { State as resourceState } from './resource'
import type { State as fetchState } from './fetch'

export type State = {
  router: routerState,
  resource: resourceState,
  fetch: fetchState,
}
