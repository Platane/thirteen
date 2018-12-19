import path from 'path'

export const PORT = process.env.PORT || 3002

export const SUBMISSION_DIR_PATH = path.resolve(
  __dirname,
  '../../../../submission'
)

export const BUILD_DIR =
  process.env.BUILD_DIR || path.resolve(__dirname, '../../.build')
