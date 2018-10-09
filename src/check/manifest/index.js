import { SUBMISSION_DIR_PATH, SIZE_LIMIT } from '../../config'

import path from 'path'
import { wrap } from '../wrap'

const btoa = x => Buffer.from(x, 'base64').toString('ascii')

export const handler = wrap(async (event, github) => {
  const { owner, repo, pull_request_number } = event

  const { data: files } = await github.pullRequests.getFiles({
    owner,
    repo,
    number: pull_request_number,
  })

  // 1

  const subdir = path
    .parse(path.relative(SUBMISSION_DIR_PATH, files[0].filename))
    .dir.split('/')
    .filter(Boolean)[0]

  const dir = path.join(SUBMISSION_DIR_PATH, subdir)

  if (!files.every(({ filename }) => path.normalize(filename).startsWith(dir)))
    return {
      conclusion: 'failure',
      output: {
        title: 'Files should be inside a submission folder',
        summary: `Files should be inside a submission folder. example :${SUBMISSION_DIR_PATH}my-awesome-submission`,
      },
    }

  // 2

  const manifestFile = files.find(
    ({ filename }) =>
      path.normalize(filename) === path.join(dir, 'manifest.json')
  )

  if (!manifestFile)
    return {
      conclusion: 'failure',
      output: {
        title: 'Should contain a manifest.json file',
        summary: `Should contain a manifest.json file`,
      },
    }

  // 3

  const manifest = await github.gitdata
    .getBlob({
      owner,
      repo,
      file_sha: manifestFile.sha,
    })
    .then(({ data: { content } }) => JSON.parse(btoa(content)))
    .catch(() => null)

  if (!manifest)
    return {
      conclusion: 'failure',
      output: {
        title: 'Should contain a manifest.json file',
        summary: `Should contain a manifest.json file with valid JSON format`,
      },
    }

  // 4

  if (typeof manifest.title !== 'string')
    return {
      conclusion: 'failure',
      output: {
        title: 'manifest.json should contains "title"',
        summary: `manifest.json should contains "title"`,
      },
    }

  // 5

  if (typeof manifest.githubRepoFullname !== 'string')
    return {
      conclusion: 'failure',
      output: {
        title: 'manifest.json should contains "githubRepoFullname"',
        summary: `manifest.json should contains "githubRepoFullname"`,
      },
    }

  // 5

  const bundleFile =
    manifest.bundlePath &&
    files.find(
      ({ filename }) =>
        path.normalize(filename) === path.join(dir, manifest.bundlePath)
    )

  if (!bundleFile)
    return {
      conclusion: 'failure',
      output: {
        title: 'manifest.json should contains "bundlePath"',
        summary: `manifest.json should contains "bundlePath" which point to the bundle`,
      },
    }

  const bundle = await github.gitdata
    .getBlob({
      owner,
      repo,
      file_sha: bundleFile.sha,
    })
    .then(({ data }) => data)
    .catch(() => null)

  if (!bundle.size > SIZE_LIMIT)
    return {
      conclusion: 'failure',
      output: {
        title: `bundle should be smaller than ${SIZE_LIMIT} o`,
        summary: [
          `bundle should be smaller than ${SIZE_LIMIT} o`,
          `The bundle is foudn to have a size of ${bundle.size}`,
        ].join('\n'),
      },
    }

  return {
    conclusion: 'success',
    output: {
      title: 'File structure looks ok',
      summary: [
        '* Every files are located inside a new submission directory',
        '* Contains a valid manifest.json',
        '* Manifest.json contains "title"',
        '* Manifest.json contains "githubRepoFullname", which links to a valid github repository',
        '* Manifest.json contains "bundlePath", which links to a bundle file smaller enought',
      ].join('\n'),
    },
  }
})
