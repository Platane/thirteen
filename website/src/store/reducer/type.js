import type { State as routerState } from './router'
import type { State as resourceState } from './resource'

export type State = {
  router: routerState,
  resource: resourceState,
}
