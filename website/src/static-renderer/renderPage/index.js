global.fetch = global.fetch || require('node-fetch')

import { selectFetchPending } from '~/store/selector'
import { create as createStore } from '~/store'
import { goTo } from '~/store/action'
import { init as initResourceFetcher } from '~/sideEffect/resourceFetcher'
import { waitFor } from '~/util/waitFor'
import { renderPageState } from './renderPageState'

export const renderPage = async (url: string) => {
  const sideEffects = [initResourceFetcher]

  const store = createStore(sideEffects)

  store.dispatch(goTo(url))

  await waitFor(store, state => !selectFetchPending(state))

  return renderPageState(store.getState())
}