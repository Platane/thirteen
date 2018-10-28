import path from 'path'
import { readMainDirectory } from '../../readSubmission/readMainDirectory'

export const key = 'file-structure'
export const title = 'File Structure'
export const description =
  'Files should be in a folder inside the submission directory'
export const check = ({ files, config }) => {
  const dir = readMainDirectory(files)

  if (!files.every(({ filename }) => path.normalize(filename).startsWith(dir)))
    return {
      result: 'failure',
      detail: 'All files are not into a submission folders',
    }

  if (!dir.match(new RegExp(`^/?${config.submissionDir}[^/]+/?$`)))
    return {
      result: 'failure',
      detail: 'Files are not inside a submission directory',
    }

  return true
}
