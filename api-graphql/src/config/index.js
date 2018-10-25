import path from 'path'

export const PORT = process.env.PORT || 3000

export const SUBMISSION_DIR_PATH = path.resolve(
  __dirname,
  '../../../submission'
)

export const BUILD_DIR =
  process.env.BUILD_DIR || path.resolve(__dirname, '../../.build')

export const APP_BASENAME = process.env.APP_BASENAME || '/'

export const SOURCE_PATH = path.resolve(BUILD_DIR, 'entries.json')
