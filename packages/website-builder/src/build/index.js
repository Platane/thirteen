import fs from 'fs'
import util from 'util'
import path from 'path'
import mkdirp from 'mkdirp'
import { renderPage } from '../renderPage'
import { parallel } from '../util/parallel'
import { copyImages } from './copyImages'
import { readEntries } from './readEntries'
import { copyGameAssets } from './copyGameAssets'

export const BUILD_DIR = path.join(__dirname, '../../.build')

export const writePage = async url => {
  const html = await renderPage(url)

  const filename = path.resolve(BUILD_DIR, url, 'index.html')

  await util.promisify(mkdirp)(path.dirname(filename))

  fs.writeFileSync(filename, html)
}

const flat = arr => [].concat(...arr)

export const writeAllPages = async () => {
  const editions = await readEntries()
  const entries = flat(editions.map(({ entries }) => entries))

  const urls = [
    /**
     * entry pages
     */
    ...entries.map(({ slug }) => `entry/${slug}`),

    /**
     * entries for edition pages
     */
    ...editions.map(({ slug }) => `entries/${slug}`),

    /**
     * home page
     */
    '',
  ]

  await parallel(8, urls.map(url => () => console.log(url) || writePage(url)))

  console.log('copy game assets')
  await parallel(8, entries.map(e => () => copyGameAssets(BUILD_DIR, e)))

  console.log('copy images')
  await parallel(8, entries.map(e => () => copyImages(BUILD_DIR, e)))
}
