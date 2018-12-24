import { renderPageState } from '@thirteen/website-builder'
import { defaultState } from '@thirteen/website/src/store/reducer'

export const render = (slug, manifest) => {
  const [entrySlug1, entrySlug2] = slug.split('/')

  const entry = {
    categories: [],
    ...manifest,
    slug,
    images: {},
  }
  Object.keys(manifest.images || {}).forEach(key => {
    entry.images[key] = path.join('images', manifst.images[key])
  })

  const state = {
    ...defaultState,
    router: {
      ...defaultState.router,
      key: 'entry',
      path: `/entry/${slug}`,
      param: {
        entrySlug1,
        entrySlug2,
      },
    },
    resource: {
      ...defaultState.resource,
      entryBySlug: {
        [slug]: entry,
      },
    },
  }

  return renderPageState(state)
}
