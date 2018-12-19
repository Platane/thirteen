import path from 'path'
import { computeSha } from './computeSha'

const split = (arr, n) =>
  Array.from({ length: Math.ceil(arr.length / n) }).map((_, i) =>
    arr.slice(i * n, (i + 1) * n)
  )

const trimManifest = ({
  sha,
  bundle_path,
  bundle_index,
  slug,
  images,
  ...manifest
}) => ({
  slug,
  ...manifest,
  game_url: `entry/${slug}/game`,
  images: Object.keys(images).reduce(
    (o, key) => ({
      ...o,
      [key]: `/entry/${slug}/images/${key}${path.extname(images[key])}`,
    }),
    {}
  ),
})

export const buildFiles = editions => {
  const files = []

  const index = {
    editions: editions.map(edition => {
      const entriesChunk = split(edition.entries, 180).map(entries => {
        const sha = computeSha(entries.reduce((s, { sha }) => s + sha, ''))

        const filename = `${edition.slug}-${sha}.json`

        files.push({
          filename,
          content: entries.map(trimManifest),
        })

        return filename
      })

      return {
        slug: edition.slug,
        categories: edition.categories,
        entriesChunk,
      }
    }),
  }

  files.push({ filename: 'index.json', content: index })

  return files
}
