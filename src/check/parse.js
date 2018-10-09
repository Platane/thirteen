import { SUBMISSION_DIR_PATH } from '../config'

import path from 'path'

export const btoa = x => Buffer.from(x, 'base64').toString('ascii')

export const parse = async (event, github) => {
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

  const manifestFile = files.find(
    ({ filename }) =>
      path.normalize(filename) === path.join(dir, 'manifest.json')
  )

  const manifest =
    manifestFile &&
    (await github.gitdata
      .getBlob({
        owner,
        repo,
        file_sha: manifestFile.sha,
      })
      .then(({ data: { content } }) => JSON.parse(btoa(content)))
      .catch(() => null))

  return { dir, manifest, files }
}
