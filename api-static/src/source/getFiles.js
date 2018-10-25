import fs from 'fs'
import path from 'path'
import { computeSha } from './computeSha'
import { SUBMISSION_DIR_PATH } from '../config'

console.log(SUBMISSION_DIR_PATH)

const readEntries = () =>
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
          slug,
          sha,
        }
      }),
  }))

const split = (arr, n) =>
  Array.from({ length: Math.ceil(arr.length / n) }).map((_, i) =>
    arr.slice(i * n, (i + 1) * n)
  )

const buildFiles = editions => {
  const files = []

  const index = {
    editions: editions.map(edition => {
      const entriesChunk = split(edition.entries, 180).map(entries => {
        const sha = computeSha(entries.reduce((s, { sha }) => s + sha, ''))

        const filename = `${edition.slug}-${sha}.json`

        files.push({
          filename,
          content: entries,
        })

        return filename
      })

      return {
        slug: edition.slug,
        entriesChunk,
      }
    }),
  }

  files.push({ filename: 'index.json', content: index })

  return files
}

export const getFiles = () => buildFiles(readEntries())
