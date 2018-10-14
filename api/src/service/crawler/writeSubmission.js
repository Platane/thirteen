import fetch from 'node-fetch'
import mkdirp from 'mkdirp'
import util from 'util'
import path from 'path'
import fs from 'fs'
import { SUBMISSION_DIR_PATH } from '../../config'

const END_POINT = 'http://js13kgames.com'

/**
 * write submission in the submission directory
 */
export const writeSubmission = async (subdirectory, entry) => {
  const DIR = path.resolve(SUBMISSION_DIR_PATH, subdirectory, entry.slug)

  await util.promisify(mkdirp)(DIR)

  const { slug, game_url, ...manifest } = entry

  fs.writeFileSync(
    path.resolve(DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  )
}
