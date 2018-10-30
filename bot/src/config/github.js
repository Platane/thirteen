export const GITHUB_APP_ID = process.env.GITHUB_APP_ID
export const GITHUB_APP_PRIVATE_KEY =
  process.env.GITHUB_APP_PRIVATE_KEY &&
  process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n')
export const APP_NAME = 'thirteen-bot'
