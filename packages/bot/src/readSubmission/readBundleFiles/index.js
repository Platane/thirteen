import path from 'path'
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

  try {
    const zip = Zip(b.content, { base64: true, checkCRC32: true })

    return Object.keys(zip.files)
      .filter(filename => !zip.files[filename].dir)
      .map(filename => ({
        filename,
        contentBuffer: zip.files[filename].asNodeBuffer(),
      }))
  } catch (err) {
    console.log(err)
    return null
  }
}
