import fs from 'fs'
import util from 'util'
import path from 'path'
import mkdirp from 'mkdirp'
import Zip from 'node-zip'
import zlib from 'zlib'

export const copyImages = (BUILD_DIR, { images, slug }) => {
  return Promise.resolve(
    Object.keys(images).map(async key => {
      const filename = path.join(
        BUILD_DIR,
        'entry',
        slug,
        'images',
        key + path.extname(images[key])
      )

      await util.promisify(mkdirp)(path.dirname(filename))

      fs.writeFileSync(filename, fs.readFileSync(images[key]))
    })
  )
}
