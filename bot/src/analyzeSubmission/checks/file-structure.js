import path from 'path'
import kebabCase from 'lodash.kebabcase'
import { readMainDirectory } from '../../readSubmission/readMainDirectory'

export const key = 'file-structure'
export const title = 'File Structure'
export const description =
  'Files should be in a folder inside the submission directory'
export const check = ({ files, config }) => {
  const dir = readMainDirectory(files)

  if (!files.every(({ status }) => status === 'added'))
    return {
      result: 'failure',
      detail: [
        'Every file should be new.',
        "Please don't touch files that don't belong to you.",
      ].join('\n'),
    }

  if (!files.every(({ filename }) => path.normalize(filename).startsWith(dir)))
    return {
      result: 'failure',
      detail: 'All files are not into a submission folders',
    }

  const r = new RegExp(`^\/?${config.submissionDir}\/([^\/]+)\/?$`)
  const [_, slug] = dir.match(r) || []

  if (!slug)
    return {
      result: 'failure',
      detail: [
        'Files are not inside a submission directory',
        `Files should be inside a directory named from your submission under the __${
          config.submissionDir
        }__ directory`,
        '',
        `For example : "${config.submissionDir}/my-awesome-game/"`,
      ].join('\n'),
    }

  if (!isKebabCase(slug))
    return {
      result: 'failure',
      detail: [
        'Directory name should be kebab case',
        `"${slug}" is not a valid directory name. Try "${kebabCase(slug)}" ?`,
      ].join('\n'),
    }

  return true
}

const isKebabCase = x => x === kebabCase(x)
