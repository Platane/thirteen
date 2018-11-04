import { STATIC_ENDPOINT } from '~/config'

const flat = arr => [].concat(...arr)

const get = path => fetch(`${STATIC_ENDPOINT}/${path}`).then(res => res.json())

export const readEntries = () =>
  get('index.json').then(async ({ editions }) =>
    flat(
      await Promise.all(
        flat(editions.map(({ entriesChunk }) => entriesChunk.map(get)))
      )
    )
  )
