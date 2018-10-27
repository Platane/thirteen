import fs from 'fs'
import path from 'path'
import { computeSha } from './computeSha'
import { SUBMISSION_DIR_PATH } from '../config'

export const readEntries = () =>
  fs.readdirSync(SUBMISSION_DIR_PATH).map(editionSlug => ({
    slug: editionSlug,
    entries: fs
      .readdirSync(path.resolve(SUBMISSION_DIR_PATH, editionSlug))
      .map(b => {
        const slug = editionSlug + '/' + b

        const manifestRaw = fs
          .readFileSync(
            path.resolve(SUBMISSION_DIR_PATH, slug, 'manifest.json')
          )
          .toString()

        const { bundle_path, bundle_index, ...manifest } = JSON.parse(
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
          image: {
            small: manifest.image['100x100'],
            big: manifest.image['400x250'],
          },
          slug,
          sha,
        }
      }),
  }))
