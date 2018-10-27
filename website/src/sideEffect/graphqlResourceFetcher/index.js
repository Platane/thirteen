import { selectToFetch } from './required'
import { getFetcher } from './fetchers'

const start = (resourceName, key, params) => ({
  type: 'resource:fetcher:start',
  resourceName,
  key,
  params,
})
const success = (resourceName, key, params, res) => ({
  type: 'resource:fetcher:success',
  resourceName,
  key,
  params,
  res,
})
const failure = (resourceName, key, params, err) => ({
  type: 'resource:fetcher:failure',
  resourceName,
  key,
  params,
  err,
})

export const init = (store: Store) => {
  const fetching = {}

  const update = async () => {
    const next = selectToFetch(store.getState()).filter(
      ({ key }) => !fetching[key]
    )[0]

    if (!next) return

    const { key, resourceName, ...params } = next

    fetching[key] = Date.now()

    const { get } = getFetcher(resourceName)

    store.dispatch(start(resourceName, key, params))

    get(params)
      .then(res => store.dispatch(success(resourceName, key, params, res)))
      .catch(err => store.dispatch(failure(resourceName, key, params, err)))

    update()
  }

  update()

  store.subscribe(update)
}
