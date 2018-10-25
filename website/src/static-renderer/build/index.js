import fs from 'fs'
import util from 'util'
import path from 'path'
import mkdirp from 'mkdirp'
import { render } from '../renderer'
import { parallel } from './parallel'
import { getEntries } from './getEntries'

const BUILD_DIRECTORY = path.resolve(__dirname, '../../.build')

export const writePage = async url => {
  const html = await render(url)

  const filename = path.resolve(BUILD_DIRECTORY, url, 'index.html')

  await util
    .promisify(mkdirp)(path.dirname(filename))
    .catch(err => 0)

  fs.writeFileSync(filename, html)
}

const flat = arr => [].concat(...arr)

export const writeAllPages = async () => {
  const res = await getEntries()

  const urls = [
    '',

    ...flat(
      res.editions.items.map(({ entries }) =>
        entries.items.map(({ slug }) => `entry/${slug}`)
      )
    ),

    ...res.editions.items.map(({ slug }) => `entries/${slug}`),
  ]

  await parallel(50, urls.map(url => () => console.log(url) || writePage(url)))
}
