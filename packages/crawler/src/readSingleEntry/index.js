import { readHtmlPage } from '../util/readHtmlPage'
import { parseEntry } from './parse'
import { END_POINT } from '../config'

export const readSingleEntry = async slug => {
  const entryUrl = `${END_POINT}/entries/${slug.split('/')[1]}`
  const gameUrl = entryUrl.replace('/entries/', '/games/')

  return {
    game_url: gameUrl,
    ...parseEntry(await readHtmlPage(entryUrl)),
  }
}
