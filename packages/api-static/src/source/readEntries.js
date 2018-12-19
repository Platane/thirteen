import fs from 'fs'
import path from 'path'
import { computeSha } from './computeSha'
import { SUBMISSION_DIR_PATH } from '../config'

const flat = arr => [].concat(...arr)
const removeDuplicated = arr => Array.from(new Set(arr))

export const readEntries = () =>
  fs.readdirSync(SUBMISSION_DIR_PATH).map(editionSlug => {
    /**
     * read the entries for this edition
     */
    const entries = fs
      .readdirSync(path.resolve(SUBMISSION_DIR_PATH, editionSlug))
      .map(b => {
        const slug = editionSlug + '/' + b

        const manifestRaw = fs
          .readFileSync(
            path.resolve(SUBMISSION_DIR_PATH, slug, 'manifest.json')
          )
          .toString()

        const { bundle_path, bundle_index, images, ...manifest } = JSON.parse(
          manifestRaw
        )

        const bundleRaw = fs
          .readFileSync(path.resolve(SUBMISSION_DIR_PATH, slug, bundle_path))
          .toString()

        const manifest_sha = computeSha(manifestRaw)
        const bundle_sha = computeSha(bundleRaw)
        const sha = computeSha(manifest_sha + bundle_sha)

        return {
          ...manifest,
          bundle_path: path.resolve(
            SUBMISSION_DIR_PATH,
            slug,
            bundle_path || 'bundle.zip'
          ),
          bundle_index: bundle_index || 'index.html',
          images: Object.keys(images).reduce(
            (o, key) => ({
              ...o,
              [key]: path.resolve(SUBMISSION_DIR_PATH, slug, images[key]),
            }),
            {}
          ),
          slug,
          sha,
        }
      })

    const categories = removeDuplicated(
      flat(entries.map(({ categories }) => categories))
    )

    return {
      slug: editionSlug,
      categories,
      entries,
    }
  })
