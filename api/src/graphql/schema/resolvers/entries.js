import { withCursor } from '../../../util/withCursor'

export const singleEntry = (_, { slug }, { entries }) =>
  entries.find(e => e.slug === slug)

const entries_ = (_, { offset, limit, categories, editions }, ctx) => {
  const allItems = ctx.entries.filter(
    e =>
      (!categories || categories.some(c => e.categories.includes(c))) &&
      (!editions || editions.some(es => es == e.editionSlug))
  )

  return {
    items: allItems.slice(offset, offset + limit),
    nItem: allItems.length,
    haveMore: allItems.length > offset + limit,
  }
}

export const entries = withCursor({ editions: null, categories: null }, 50)(
  entries_
)
