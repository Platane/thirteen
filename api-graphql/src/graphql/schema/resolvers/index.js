import { editions, singleEdition } from './editions'
import { entries, singleEntry } from './entries'
import { categories } from './categories'

export { Date } from './date'
export * as Image from './image'

export const Query = {
  editions,
  singleEdition,
  entries,
  singleEntry,

  categories,
}

export const Edition = {
  entries: ({ slug }, param, ctx) =>
    entries({}, { ...param, editions: [slug] }, ctx),

  categories: ({ slug }, param, ctx) =>
    categories({}, { ...param, editions: [slug] }, ctx),
}

export const Entry = {
  edition: ({ editionSlug }, _, ctx) =>
    singleEdition({}, { slug: editionSlug }, ctx),
}
