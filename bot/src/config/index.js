export * as aws from './aws'
export * as github from './github'

import path from 'path'

export const SUBMISSION_DIR_PATH = 'submission/'
export const SIZE_LIMIT = 13 * 1024

export const WORKING_DIR = path.resolve(__dirname, '../../.build')
export const BUCKET_NAME = 'siasisa20329asd0d0120'
export const LABEL_NAME = 'submission'
export const IMAGES = {
  small: {
    width: 100,
    height: 100,
    sizeLimit: 100 * 1024,
  },
  big: {
    width: 300,
    height: 200,
    sizeLimit: 100 * 1024,
  },
}
