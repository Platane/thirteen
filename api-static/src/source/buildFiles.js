import { computeSha } from './computeSha'

const split = (arr, n) =>
  Array.from({ length: Math.ceil(arr.length / n) }).map((_, i) =>
    arr.slice(i * n, (i + 1) * n)
  )

export const buildFiles = editions => {
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
