import path from 'path'
import { readMainDirectory } from '../readMainDirectory'

export const readBundleSha = (files, manifest) => {
  const mainDir = readMainDirectory(files)

  const bundleFilename =
    manifest && path.join(mainDir, manifest.bundle_path || 'bundle.zip')

  const b =
    bundleFilename &&
    files.find(({ filename }) => path.normalize(filename) === bundleFilename)

  return b.sha
}
