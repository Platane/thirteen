export const routes = [
  { path: '/', key: 'home' },
  { path: '/edition/:editionSlug', key: 'edition' },
  { path: '/edition/:editionSlug/:category', key: 'edition' },
  { path: '/entries/:editionSlug', key: 'edition' },
  { path: '/entries/:editionSlug/:category', key: 'edition' },
  { path: '/entry/:entrySlug1/:entrySlug2', key: 'entry' },
]
