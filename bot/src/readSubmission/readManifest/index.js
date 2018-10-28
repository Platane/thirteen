import path from 'path'
import { readMainDirectory } from '../readMainDirectory'
import { safeJSONparse } from '../../util/json'
import { decodeBase64 } from '../../util/base64'

export const readManifest = files => {
  const mainDir = readMainDirectory(files)

  const m = files.find(
    ({ filename }) =>
      path.normalize(filename) === path.join(mainDir, 'manifest.json')
  )

  return m && safeJSONparse(decodeBase64(m.content))
}
