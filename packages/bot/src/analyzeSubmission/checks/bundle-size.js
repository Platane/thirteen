import path from 'path'
import { readMainDirectory } from '../../readSubmission/readMainDirectory'

export const key = 'bundle-size'
export const title = 'Bundle size'
export const description = 'Bundle should be smaller that 13k'
export const check = ({ files, manifest }) => {
  const mainDir = readMainDirectory(files)

  const bundleFilename =
    manifest && path.join(mainDir, manifest.bundle_path || 'bundle.zip')

  const b =
    bundleFilename &&
    files.find(({ filename }) => path.normalize(filename) === bundleFilename)

  if (!b)
    return {
      result: 'failure',
      detail: 'Bundle not found',
    }

  if (b.size > 13 * 1024)
    return {
      result: 'failure',
      detail: [
        `bundle is found to have a size of ${b.size}o,`,
        `which is more than the ${13 * 1024}o allowed`,
      ].join(' '),
    }

  return true
}
