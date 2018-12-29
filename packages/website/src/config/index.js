export const APP_BASENAME = process.env.APP_BASENAME || '/'

export const APP_ORIGIN =
  process.env.APP_ORIGIN ||
  (typeof location !== 'undefined' && location.origin + APP_BASENAME) ||
  null

export const TWITTER_SITE_USER = '@js13kGames'

export const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT

export const STATIC_ENDPOINT =
  process.env.STATIC_ENDPOINT || APP_ORIGIN + 'data'
