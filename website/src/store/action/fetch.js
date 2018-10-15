export const preloadEntry = entrySlug => ({
  type: 'resource:fetcher:preload',
  resourceName: 'entry',
  params: { entrySlug },
  key: `entry/$${entrySlug}`,
})
