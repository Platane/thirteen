import { renderPageState } from '@thirteen/website-builder'
import { defaultState } from '@thirteen/website/src/store/reducer'

export const render = (slug, manifest) => {
  const [entrySlug1, entrySlug2] = slug.split('/')

  return renderPageState({
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
        [slug]: { slug, categories: [], ...manifest },
      },
    },
  })
}
