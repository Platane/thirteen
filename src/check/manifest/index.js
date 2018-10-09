import { SUBMISSION_DIR_PATH, WORKING_DIR, SIZE_LIMIT } from '../../config'

import path from 'path'
import { wrap } from '../wrap'
import { parse } from '../parse'
import { validateSchema } from './schema'

const btoa = x => Buffer.from(x, 'base64').toString('ascii')

export const handler = wrap(async (event, github) => {
  const { owner, repo, pull_request_number } = event

  const { files, dir, ...res } = await parse(event, github)

  // 1
  if (!files.every(({ filename }) => path.normalize(filename).startsWith(dir)))
    return {
      conclusion: 'failure',
      output: {
        title: 'Files should be inside a submission folder',
        summary: `Files should be inside a submission folder. example :${SUBMISSION_DIR_PATH}my-awesome-submission`,
      },
    }

  // 2
  if (!res.manifest)
    return {
      conclusion: 'failure',
      output: {
        title: 'Should contain a manifest.json file',
        summary: `Should contain a manifest.json file`,
      },
    }

  // 3
  const { value: manifest, error } = validateSchema(res.manifest, {
    github_user_login: owner.login,
  })
  if (error)
    return {
      conclusion: 'failure',
      output: {
        title: 'manifest.json should respect the schema',
        summary: `manifest.json should respect the schema`,
        text: error.details
          .map(({ message, path }) => `- ${message}   at [${path.join(', ')}]`)
          .join('\n'),
      },
    }

  // 5
  const bundleFile = files.find(
    ({ filename }) =>
      path.normalize(filename) === path.join(dir, manifest.bundle_path)
  )

  if (!bundleFile)
    return {
      conclusion: 'failure',
      output: {
        title: 'manifest.json bundle_path should link to a zip file',
        summary: [
          `manifest.json bundle_path should link to a zip file.`,
          `Could not find anything at ${manifest.bundle_path}`,
        ].join('\n'),
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
          `The bundle is found to have a size of ${bundle.size}`,
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
