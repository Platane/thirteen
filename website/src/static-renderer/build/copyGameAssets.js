import fs from 'fs'
import util from 'util'
import path from 'path'
import mkdirp from 'mkdirp'
import Zip from 'node-zip'
import zlib from 'zlib'

export const copyGameAssets = (
  BUILD_DIR,
  { bundle_path, bundle_index, slug }
) => {
  const zip = Zip(fs.readFileSync(bundle_path), {
    base64: false,
    checkCRC32: true,
  })

  return Promise.resolve(
    Object.keys(zip.files)
      .filter(key => !zip.files[key].dir)
      .map(async key => {
        const { name, _data } = zip.files[key]

        const filename = path.join(
          BUILD_DIR,
          'entry',
          slug,
          'game',
          name === bundle_index ? 'index.html' : name
        )

        await util.promisify(mkdirp)(path.dirname(filename))

        fs.writeFileSync(filename, _data)
      })
  )
}
