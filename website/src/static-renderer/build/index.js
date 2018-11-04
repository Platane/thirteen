import fs from 'fs'
import util from 'util'
import path from 'path'
import mkdirp from 'mkdirp'
import { renderPage } from '../renderPage'
import { parallel } from '~/util/parallel'
import { getEntries } from './getEntries'

export const BUILD_DIR = path.join(__dirname, '../../../.build')

export const writePage = async url => {
  const html = await renderPage(url)

  const filename = path.resolve(BUILD_DIR, url, 'index.html')

  await util.promisify(mkdirp)(path.dirname(filename))

  fs.writeFileSync(filename, html)
}

const flat = arr => [].concat(...arr)

export const writeAllPages = async () => {
  const res = await getEntries()

  const urls = [
    ...flat(
      res.editions.items.map(({ entries }) =>
        entries.items.map(({ slug }) => `entry/${slug}`)
      )
    ),

    ...res.editions.items.map(({ slug }) => `entries/${slug}`),

    '',
  ]

  await parallel(50, urls.map(url => () => console.log(url) || writePage(url)))
}
