import createApp from 'github-app'
import { readSubmission } from './readSubmission'
import { analyzeSubmission, checkNames } from './analyzeSubmission'
import { GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY } from './config/github'
import { LABEL_NAME } from './config'

import type { APIGatewayEvent, ProxyResult } from 'flow-aws-lambda'
import type { Event, File } from './type'

export const handler = async (e: APIGatewayEvent): Promise<ProxyResult> => {
  const event: Event = JSON.parse(e.body)

  console.log(event)

  if (['rerequested', 'requested'].includes(event.action)) return

  /**
   * create github api client
   */
  const github = await createApp({
    id: GITHUB_APP_ID,
    cert: GITHUB_APP_PRIVATE_KEY,
  }).asInstallation(event.installation.id)

  /**
   * ignore some cases
   */
  if (event.pull_request.state !== 'open') return

  if (!event.pull_request.labels.some(({ name }) => name === LABEL_NAME)) return

  /**
   * prepare the report
   */
  const reportRuns = await createReportRuns(github, event.pull_request)

  /**
   * read the submission
   */
  const s = await readSubmission(github)(event.pull_request)

  /**
   * analyze the submission
   */
  const checks = await analyzeSubmission({ ...event, ...s, github })

  /**
   * fire the report
   */
  await reportRuns(checks)

  console.log(checks)
}

const createReportRuns = async (github, pr) => {
  const runIds = {}

  /**
   * create the check, as queued
   */
  await Promise.all(
    checkNames.map(({ key, title }) =>
      github.checks
        .create({
          owner: pr.base.repo.owner.login,
          repo: pr.base.repo.name,
          name: title,
          head_sha: pr.head.sha,
          status: 'queued',
        })
        .then(({ data: { id } }) => (runIds[key] = id))
    )
  )

  /**
   * update the checks
   */
  return checks =>
    Promise.all(
      checks.map(({ key, title, description, result: conclusion, detail }) =>
        github.checks.update({
          owner: pr.base.repo.owner.login,
          repo: pr.base.repo.name,
          check_run_id: runIds[key],
          completed_at: new Date().toISOString(),
          status: 'completed',
          conclusion,
          output: {
            title,
            summary: `__${description || ''}__\n\n${detail || ''}`,
          },
        })
      )
    )
}
