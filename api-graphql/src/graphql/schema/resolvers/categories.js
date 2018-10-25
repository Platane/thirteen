import { withCursor } from '../../../util/withCursor'

const flat = arr => [].concat(...arr)
const removeDuplicate = arr => Array.from(new Set(arr))

export const categories_ = (_, { editions, offset, limit }, ctx) => {
  const allItems = removeDuplicate(
    flat(
      ctx.entries
        .filter(x => editions.includes(x.editionSlug))
        .map(c => c.categories)
    )
  )

  return {
    items: allItems.slice(offset, offset + limit),
    nItem: allItems.length,
    haveMore: allItems.length > offset + limit,
  }
}

export const categories = withCursor({ editions: null }, 50)(categories_)
