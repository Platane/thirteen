import mkdirp from 'mkdirp'
import util from 'util'
import path from 'path'
import fs from 'fs'
import { computeSha } from '../util/computeSha'
import { SUBMISSION_DIR_PATH } from '../config'

export const writeSubmission = async (slug, manifest, bundleContent) => {
  const DIR = path.resolve(SUBMISSION_DIR_PATH, slug)

  await util.promisify(mkdirp)(DIR)

  manifest.bundle_path = 'bundle.zip'
  manifest.bundle_index = 'index.html'

  fs.writeFileSync(
    path.resolve(DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  )

  fs.writeFileSync(path.resolve(DIR, 'bundle.zip'), bundleContent, 'binary')
}
