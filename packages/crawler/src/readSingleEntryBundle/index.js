import { END_POINT } from '../config'
import puppeteer from 'puppeteer'
import fetch from 'node-fetch'
import path from 'path'
import JSZip from 'node-zip'

const wait = delay => new Promise(r => setTimeout(r, delay))

export const readSingleEntryBundle = async gameUrl => {
  const indexHtml = gameUrl + '/index.html'

  const requests = []

  const browser = await puppeteer.launch({
    defaultViewport: { width: 600, height: 400 },
  })

  const page = await browser.newPage()

  page.on('request', request => requests.push(request.url()))

  await page.goto(indexHtml)

  await wait(500)

  await browser.close()

  const filenames = requests
    .map(x => path.relative(gameUrl, x))
    .filter(x => !x.match(/^..\//))

  const zip = new JSZip()

  await Promise.all(
    filenames.map(filename =>
      fetch(gameUrl + '/' + filename)
        .then(x => x.arrayBuffer())
        .then(content => zip.file(filename, new Buffer(content)))
    )
  )

  return zip.generate({ base64: false, compression: 'DEFLATE' })
}
