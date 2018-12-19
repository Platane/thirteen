import { createSelector } from 'reselect'
import { APP_ORIGIN, TWITTER_SITE_USER } from '../../config'
import { selectCurrentEntry, selectCurrentEditionSlug } from './entry'
import type { State } from '../type'

const selectFetch = (state: State) => state.fetch

export const selectMetaTitle = () => '13kjs'

export const selectMetaImage = createSelector(
  selectCurrentEntry,

  entry => {
    if (entry && entry.images.large) return entry.images.large
    return 'https://github.com/platane.png'
  }
)

export const selectMetaDecription = createSelector(
  selectCurrentEntry,
  selectCurrentEditionSlug,

  (entry, editionSlug) =>
    (entry && `${entry.title}, a 13kjs game`) ||
    (editionSlug && `${editionSlug} edition entries`) ||
    'this is a description'
)

const selectTwitterCreator = createSelector(
  selectCurrentEntry,

  entry => {
    if (entry && entry.authors[0] && entry.authors[0].twitter)
      return '@' + entry.authors[0].twitter
  }
)

export const selectUrl = state => APP_ORIGIN + state.router.path

export const selectMetaProperties = createSelector(
  selectUrl,
  selectMetaTitle,
  selectMetaImage,
  selectMetaDecription,
  selectTwitterCreator,

  (url, title, imageUrl, description, twitterCreator) =>
    [
      { name: 'og:url', content: url },
      { name: 'og:locale', content: 'en_US' },
      { name: 'og:image', content: imageUrl },
      { name: 'og:title', content: title },
      { name: 'og:description', content: description },

      { name: 'twitter:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },
      { name: 'twitter:site', content: TWITTER_SITE_USER },
      twitterCreator && { name: 'twitter:creator', content: twitterCreator },
    ].filter(Boolean)
)
