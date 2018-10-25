import { readHtmlPage } from '../util/readHtmlPage'
import { parseEntryList } from './parse'
import { END_POINT } from '../config'

export const readEntryList = async slug =>
  parseEntryList(slug, await readHtmlPage(`${END_POINT}/entries/${slug}`))
