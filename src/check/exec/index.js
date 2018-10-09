import { SUBMISSION_DIR_PATH } from '../../config'

import fs from 'fs'
import path from 'path'
import Zip from 'node-zip'
import { PNG } from 'pngjs'
import { wrap } from '../wrap'
import { parse, btoa } from '../parse'
import { getPngColorDerication } from '../../service/png'
import puppeteer from 'puppeteer'

const wait = delay => new Promise(r => setTimeout(r, delay))

export const handler = wrap(async (event, github) => {
  const { manifest, files, dir } = await parse(event, github)
  const { owner, repo } = event

  const bundleFile =
    manifest &&
    manifest.bundlePath &&
    files.find(
      ({ filename }) =>
        path.normalize(filename) === path.join(dir, manifest.bundlePath)
    )

  const bundleB64 =
    bundleFile &&
    (await github.gitdata
      .getBlob({
        owner,
        repo,
        file_sha: bundleFile.sha,
      })
      .then(({ data: { content } }) => content)
      .catch(() => null))

  let zip

  try {
    zip = Zip(bundleB64, { base64: true, checkCRC32: true })
  } catch (err) {
    return {
      conclusion: 'failure',
      output: {
        title: 'should contain a valid zip bundle',
        summary: `should contain a valid zip bundle`,
      },
    }
  }

  const DIR = path.resolve(process.cwd(), '.build')

  Object.keys(zip.files).forEach(fileName => {
    const { name, _data } = zip.files[fileName]

    fs.writeFileSync(path.join(DIR, name), _data)
  })

  let errors = []
  let requests = []

  const screenshotPath = path.resolve(DIR, 'screenshot.png')

  const browser = await puppeteer.launch({
    defaultViewport: { width: 600, height: 400 },
  })
  const page = await browser.newPage()

  page.on('error', err => errors.push(err))
  page.on('request', request => requests.push(request.url()))

  await page.goto(
    'file://' + path.resolve(process.cwd(), '.build', 'index.html')
  )

  await wait(500)

  await page.screenshot({ path: screenshotPath })

  await browser.close()

  if (errors.length > 0)
    return {
      conclusion: 'failure',
      output: {
        title: 'should not throws error',
        summary: `should not throws error`,
        text: errors.join('\n\n'),
      },
    }

  console.log('---')

  const externalRequests = requests.filter(url => !url.startsWith('file://'))
  if (externalRequests.length > 0)
    return {
      conclusion: 'failure',
      output: {
        title: 'should not make http requests to the outside',
        summary: `should not make http requests to the outside. We detected that the game made external http call`,
        text: externalRequests.join('\n\n'),
      },
    }

  const colord = getPngColorDerication(screenshotPath)

  if (colord === 0)
    return {
      conclusion: 'failure',
      output: {
        title: 'screen should be not blank',
        summary: `screen should be not blank. We detected that the screen was monochromatic after loading`,
      },
    }

  return {
    conclusion: 'success',
    output: {
      title: "Game looks like it's not broken",
      summary: [].join('\n'),
    },
  }
})
