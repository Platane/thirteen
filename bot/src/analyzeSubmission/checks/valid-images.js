import path from 'path'
import getPixel from 'get-pixels'
import { promisify } from 'util'
import { readMainDirectory } from '../../readSubmission/readMainDirectory'
import { IMAGES } from '../../config'

export const key = 'valid-images'
export const title = 'Valid Images'
export const description = 'Should contains valid images'
export const check = async ({ files, manifest }) => {
  const mainDir = readMainDirectory(files)

  if (!manifest) return false

  const n = await Promise.all(
    Object.keys(IMAGES).map(async key => {
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

      if (IMAGES[key].width !== width || IMAGES[key].height !== height)
        return [
          `Image "${key}" does not meet the required resolution.`,
          `Should be ${IMAGES[key].width}x${IMAGES[key].height},`,
          `but is ${width}x${height}`,
        ].join(' ')

      if (b.size > IMAGES[key].sizeLimit)
        return `Image "${key}" is over the ${
          IMAGES[key].sizeLimit
        }o size limit.`
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
