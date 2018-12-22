import path from 'path'
import zlib from 'zlib'
import Zip from 'node-zip'
import { promisify } from 'util'

import { readMainDirectory } from '../readMainDirectory'

export const readBundleFiles = async (manifest, files) => {
  const mainDir = readMainDirectory(files)

  const bundleFilename = path.join(
    mainDir,
    manifest.bundle_path || 'bundle.zip'
  )

  const b =
    bundleFilename &&
    files.find(({ filename }) => path.normalize(filename) === bundleFilename)

  // const res = zlib.inflateRawSync(Buffer.from(b.content, 'base64'))

  try {
    const zip = Zip(b.content, { base64: true, checkCRC32: true })

    return Object.keys(zip.files)
      .filter(key => !zip.files[key].dir)
      .map(key => {
        const { name: filename, _data: content } = zip.files[key]

        return { content, filename }
      })
  } catch (err) {
    console.log(err)
    return null
  }
}
