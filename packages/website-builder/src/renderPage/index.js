global.fetch = global.fetch || require('node-fetch')

import { selectFetchPending } from '@thirteen/website/src/store/selector'
import { create as createStore } from '@thirteen/website/src/store'
import { goTo } from '@thirteen/website/src/store/action'
import { init as initResourceFetcher } from '@thirteen/website/src/sideEffect/staticResourceFetcher'
import { waitFor } from '../util/waitFor'
import { renderPageState } from './renderPageState'
import { trimState } from './trimState'

export const renderPage = async (url: string) => {
  const sideEffects = [initResourceFetcher]

  const store = createStore(sideEffects)

  store.dispatch(goTo(url))

  await waitFor(store, state => !selectFetchPending(state))

  return renderPageState(trimState(store.getState()))
}
