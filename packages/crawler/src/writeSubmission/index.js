import mkdirp from 'mkdirp'
import util from 'util'
import path from 'path'
import fs from 'fs'
import { SUBMISSION_DIR_PATH } from '../config'

export const writeSubmission = async (
  slug,
  manifest,
  bundleContent,
  imagesContent
) => {
  const DIR = path.resolve(SUBMISSION_DIR_PATH, slug)

  await util.promisify(mkdirp)(DIR)
  await util.promisify(mkdirp)(path.join(DIR, 'images'))

  manifest.bundle_path = 'bundle.zip'
  manifest.bundle_index = 'index.html'
  manifest.images = {}

  Object.keys(imagesContent).forEach(key => {
    const { ext, content } = imagesContent[key]

    const name = path.join('images', key + ext)
    manifest.images[key] = name

    fs.writeFileSync(path.resolve(DIR, name), content, 'binary')
  })

  fs.writeFileSync(path.resolve(DIR, 'bundle.zip'), bundleContent, 'binary')

  fs.writeFileSync(
    path.resolve(DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  )
}
