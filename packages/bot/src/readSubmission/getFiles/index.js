import path from 'path'
import type { PullRequest } from '../../type'

export const getFiles = github => async (pr: PullRequest) => {
  const { data: files } = await github.pullRequests.listFiles({
    owner: pr.base.repo.owner.login,
    repo: pr.base.repo.name,
    number: pr.number,
  })

  return Promise.all(
    files.map(({ sha, status, filename }) =>
      github.gitdata
        .getBlob({
          owner: pr.base.repo.owner.login,
          repo: pr.base.repo.name,
          file_sha: sha,
        })
        .then(({ data: { content, size } }) => ({
          status,
          filename,
          size,
          content,
          sha,
        }))
    )
  )
}
