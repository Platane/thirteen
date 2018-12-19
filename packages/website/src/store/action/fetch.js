export const preloadEntry = entrySlug => ({
  type: 'resource:fetcher:preload',
  resourceName: 'entry',
  params: { entrySlug },
  key: `entry/$${entrySlug}`,
})

export const preloadEntries = editionSlug => ({
  type: 'resource:fetcher:preload',
  resourceName: 'entries',
  params: { editionSlug },
  key: `entries/$${editionSlug}`,
})
