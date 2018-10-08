import { GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY } from '../config'

const createApp = require('github-app')

export const wrap = handler => async event => {
  const github = await createApp({
    id: GITHUB_APP_ID,
    cert: GITHUB_APP_PRIVATE_KEY,
  }).asInstallation(event.installation_id)

  const { owner, repo, check_run_id } = event

  await github.checks.update({
    owner,
    repo,
    check_run_id,
    status: 'in_progress',
  })

  const res = await handler(event, github).catch(
    err =>
      console.error(err) || {
        conclusion: 'failure',
        output: {
          title: 'Internal Error',
          summary: 'Encoutner an unexpected error while running the test',
          text: err.toString(),
        },
      }
  )

  await github.checks.update({
    ...res,
    owner,
    repo,
    check_run_id,
    completed_at: new Date().toISOString(),
    status: 'completed',
  })
}
