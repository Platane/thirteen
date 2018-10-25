import { readEntryList } from './readEntryList'
import { readSingleEntry } from './readSingleEntry'
import { readSingleEntryBundle } from './readSingleEntryBundle'
import { writeSubmission } from './writeSubmission'
import { parallel } from './util/parallel'

const flat = arr => [].concat(...arr)

const crawl = async editions => {
  const entries = flat(await Promise.all(editions.map(readEntryList)))

  const tasks = entries.map(slug => async () => {
    console.log(slug)

    const { game_url, ...manifest } = await readSingleEntry(slug)
    const bundleContent = await readSingleEntryBundle(game_url)

    await writeSubmission(slug, manifest, bundleContent)
  })

  await parallel(3, tasks)
}

const years = Array.from({ length: 7 }).map((_, i) => (2012 + i).toString())

module.exports = () => crawl(years)
