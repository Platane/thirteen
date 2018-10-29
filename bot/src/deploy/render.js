import { renderPageState } from './website/build/static-renderer/renderPage/renderPageState'
import { defaultState } from './website/build/store/reducer'
// import { renderState } from '@thirteen/website/src/static-renderer/renderPage/renderPageState'

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
