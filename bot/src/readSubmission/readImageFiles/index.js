import path from 'path'
import { readMainDirectory } from '../readMainDirectory'

export const readImageFiles = (manifest, files) => {
  const mainDir = readMainDirectory(files)

  const imageFiles = {}

  Object.keys(manifest.images || {}).forEach(key => {
    imageFiles[key] = files.find(
      ({ filename }) =>
        path.normalize(filename) === path.join(mainDir, manifest.images[key])
    )
  })

  return imageFiles
}
