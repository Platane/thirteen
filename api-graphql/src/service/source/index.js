import fs from 'fs'
import path from 'path'
import { SUBMISSION_DIR_PATH, SOURCE_PATH } from '../../config'

const flat = arr => [].concat(...arr)

export const readEntries = () =>
  flat(
    fs.readdirSync(SUBMISSION_DIR_PATH).map(year =>
      fs.readdirSync(path.resolve(SUBMISSION_DIR_PATH, year)).map(slug => {
        const manifestRaw = fs
          .readFileSync(
            path.resolve(SUBMISSION_DIR_PATH, year, slug, 'manifest.json')
          )
          .toString()

        const manifest = JSON.parse(manifestRaw)

        return {
          ...manifest,
          editionSlug: year.toString(),
          slug: `${year}/${slug}`,
        }
      })
    )
  )

fs.writeFileSync(SOURCE_PATH, JSON.stringify(readEntries()))
