import { SUBMISSION_DIR_PATH, WORKING_DIR } from '../../config'

import fs from 'fs'
import path from 'path'
import Zip from 'node-zip'
import { PNG } from 'pngjs'
import { wrap } from '../wrap'
import { parse, btoa } from '../parse'
import { upload } from '../../service/storage'
import puppeteer from 'puppeteer'
import { validateSchema } from '../manifest/schema'

export const handler = wrap(async (event, github) => {
  const { files, dir, ...res } = await parse(event, github)
  const { owner, repo } = event

  const { value: manifest, error } = validateSchema(res.manifest, {
    github_user_login: owner.login,
  })

  const bundleFile =
    manifest &&
    files.find(
      ({ filename }) =>
        path.normalize(filename) === path.join(dir, manifest.bundle_path)
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

  const key = bundleFile.sha

  let indexUrl

  Object.keys(zip.files).forEach(async filename => {
    const { _data } = zip.files[filename]

    console.log(path.join(key, filename), manifest)

    const url = await upload(path.join(key, filename), btoa(_data))

    if (path.normalize(filename) === path.normalize(manifest.bundle_index))
      indexUrl = url
  })

  return {
    conclusion: 'success',
    output: {
      title: `Game deployed [${indexUrl}](indexUrl)`,
      summary: ['Game deployed at ', `[${indexUrl}](indexUrl)`].join('\n'),
    },
  }
})
