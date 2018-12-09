export * as aws from './aws'
export * as github from './github'
export * as browserstack from './browserstack'

import path from 'path'

export const WORKING_DIR = path.resolve(__dirname, '../../.build')
export const BUCKET_NAME =
  process.env.SUBMISSION_BUCKET_NAME || 'siasisa20329asd0d0120'
