import { readEntries } from './readEntries'
import { writeSubmission } from './writeSubmission'

const crawl = async subdirectory => {
  const entries = await readEntries(subdirectory)

  for (let i = entries.length; i--; )
    await writeSubmission(subdirectory, entries[i]).catch(err =>
      console.log(err)
    )
}

const years = Array.from({ length: 7 }).map((_, i) => (2012 + i).toString())

//
;(async () => {
  for (let i = years.length; i--; ) await crawl(years[i])
})()
