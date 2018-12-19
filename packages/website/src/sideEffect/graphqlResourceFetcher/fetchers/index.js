export const fetchers = [
  //
  require('./entry'),
  require('./entries'),
  require('./editions'),
]

export const getFetcher = resourceName =>
  fetchers.find(f => f.resourceName === resourceName)
