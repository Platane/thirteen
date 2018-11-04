import fs from 'fs'
import util from 'util'
import path from 'path'
import mkdirp from 'mkdirp'
import { renderPage } from '../renderPage'
import { parallel } from '~/util/parallel'
import { readEntries } from './readEntries'
import { copyGameAssets } from './copyGameAssets'

export const BUILD_DIR = path.join(__dirname, '../../../.build')

export const writePage = async url => {
  const html = await renderPage(url)

  const filename = path.resolve(BUILD_DIR, url, 'index.html')

  await util.promisify(mkdirp)(path.dirname(filename))

  fs.writeFileSync(filename, html)
}

const flat = arr => [].concat(...arr)
const removeDuplicated = arr => Array.from(new Set(arr))

export const writeAllPages = async () => {
  const entries = await readEntries()

  const urls = [
    /**
     * entry pages
     */
    ...entries.map(({ slug }) => `entry/${slug}`),

    /**
     * entries for edition pages
     */
    ...removeDuplicated(entries.map(({ slug }) => slug.split('/')[0])).map(
      slug => `entries/${slug}`
    ),

    /**
     * home page
     */
    '',
  ]

  await parallel(50, urls.map(url => () => console.log(url) || writePage(url)))

  await parallel(10, entries.map(e => () => copyGameAssets(BUILD_DIR, e)))
}
