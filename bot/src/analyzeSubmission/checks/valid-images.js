import path from 'path'
import getPixel from 'get-pixels'
import { promisify } from 'util'
import { readMainDirectory } from '../../readSubmission/readMainDirectory'

export const key = 'valid-images'
export const title = 'Valid Images'
export const description = 'Should contains valid images'
export const check = async ({ files, config, manifest }) => {
  const mainDir = readMainDirectory(files)

  if (!manifest) return false

  const n = await Promise.all(
    Object.keys(config.images).map(async key => {
      const imageFilename =
        manifest.images &&
        manifest.images[key] &&
        path.join(mainDir, manifest.images[key])

      const b =
        imageFilename &&
        files.find(({ filename }) => path.normalize(filename) === imageFilename)

      if (!b) return `Image "${key}" was not found`

      const type = `image/${path.extname(imageFilename).slice(1)}`

      const {
        shape: [width, height],
      } = await promisify(getPixel)(Buffer.from(b.content, 'base64'), type)

      const spec = config.images[key]

      if (spec.width !== width || spec.height !== height)
        return [
          `Image "${key}" does not meet the required resolution.`,
          `Should be ${spec.width}x${spec.height},`,
          `but is ${width}x${height}`,
        ].join(' ')

      if (b.size > spec.sizeLimit)
        return `Image "${key}" is over the ${spec.sizeLimit}o size limit.`
    })
  )

  return {
    result: n.some(Boolean) ? 'failure' : 'success',
    detail: n
      .filter(Boolean)
      .map(x => `- ${x}`)
      .join('\n'),
  }
}
