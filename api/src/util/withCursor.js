import { encodeBase64, decodeBase64 } from './base64'
import { safeJSONparse } from './json'

/**
 * wrap the resolver
 * handle the cursor parsing logic
 *
 * the param for the request is built following those rules:
 *  - if a cursor property exist, take it first
 *  - else take the param
 *  - else take the default param
 */
export const withCursor = (defaultParams, max_limit) => resolver => async (
  a,
  params,
  ctx
) => {
  /**
   * default params
   */
  let offset = 0
  let limit = Infinity
  const p = { ...defaultParams }

  /**
   * overwite with params
   */
  for (let key in defaultParams) p[key] = key in params ? params[key] : p[key]

  if ('limit' in params) limit = params.limit

  /**
   * overwite with cursor
   */
  const cursor = params.cursor && safeJSONparse(decodeBase64(params.cursor))
  if (cursor) {
    for (let key in defaultParams) p[key] = cursor[key]

    offset = cursor.offset
  }

  limit = Math.min(limit, max_limit)

  /**
   * call the resolver
   */
  const { haveMore, items, nItem } = await resolver(
    a,
    { ...p, limit, offset },
    ctx
  )

  return {
    items,
    nItem,
    haveMore,
    nextCursor: haveMore
      ? encodeBase64(JSON.stringify({ ...p, offset: offset + limit }))
      : null,
  }
}
