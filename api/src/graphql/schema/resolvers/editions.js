import { withCursor } from '../../../util/withCursor'

const getEdition = (entries, slug) => ({
  year: slug,
  slug,
  entries: entries.filter(e => e.editionSlug === slug),
})

export const singleEdition = (_, { slug }, ctx) => getEdition(ctx.entries, slug)

const flat = arr => [].concat(...arr)
const removeDuplicate = arr => Array.from(new Set(arr))

export const editions_ = (_, { offset, limit }, ctx) => {
  const allItems = removeDuplicate(ctx.entries.map(c => c.editionSlug)).map(
    slug => getEdition(ctx.entries, slug)
  )

  return {
    items: allItems.slice(offset, offset + limit),
    nItem: allItems.length,
    haveMore: allItems.length > offset + limit,
  }
}

export const editions = withCursor({}, 10)(editions_)
