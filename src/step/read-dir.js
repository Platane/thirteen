import path from 'path'
import { SUBMISSION_DIR_PATH } from '../config'

export const stepName = 'read-dir'

export const dependencies = []

export const runName = 'folder-structure'

export const exec = async ctx => {
  /**
   * get the files for the PR
   */
  const { data: files } = await ctx.github.pullRequests.getFiles({
    owner: ctx.owner,
    repo: ctx.repo,
    number: ctx.pull_request_number,
  })

  /**
   * get the submission subdirectory where the first file is
   */
  const subdir = path
    .parse(path.relative(SUBMISSION_DIR_PATH, files[0].filename))
    .dir.split('/')
    .filter(Boolean)[0]

  const dir = path.join(SUBMISSION_DIR_PATH, subdir)

  /**
   * check that every file is in the same directory
   */
  const everyFileIsInDir = files.every(({ filename }) =>
    path.normalize(filename).startsWith(dir)
  )

  /**
   * report
   */
  ctx.runResult[runName].results.push({
    success: subdir && everyFileIsInDir,
    label: 'Files should be in folder inside the submission directory',
  })

  return { ...ctx, dir, files }
}
