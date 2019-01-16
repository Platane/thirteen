import path from 'path'
import fetch from 'node-fetch'
import webdriver from 'selenium-webdriver'
import getPixels from 'get-pixels'
import { promisify } from 'util'
import {
  BROWSER_STACK_USER,
  BROWSER_STACK_KEY,
} from '../../config/browserstack'

export const key = 'source-repositoy'
export const title = 'Source repositoy'
export const description = 'Check the source github repositoy'

export const check = async ({ github, manifest }) => {
  if (!manifest) return false

  const match = manifest.github_repository.match(
    /((((https?)?:\/\/)?github.com)?\/)?([^\/]+)\/([^\/]+)$/
  )

  if (!match) return false

  const owner = match[5]
  const repo = match[6]

  try {
    const { data: result } = await github.repos.get({ owner, repo })

    if (result)
      return {
        result: 'success',
        detail: 'manifest.github_repository is a valid github repositoy',
      }
  } catch (err) {
    if (err && err.code === 404)
      return {
        result: 'failure',
        detail: `the repositoy "github.com/${owner}/${repo}" does not exist`,
      }

    throw err
  }

  return false
}
