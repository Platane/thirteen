import createApp from 'github-app'
import { readConfig } from './readConfig'
import { readSubmission } from './readSubmission'
import { createReportRuns } from './createReportRuns'
import { analyzeSubmission, checkNames } from './analyzeSubmission'
import { GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY } from './config/github'

import type { APIGatewayEvent, ProxyResult } from 'flow-aws-lambda'
import type { Event, File } from './type'

export const handler = async (e: APIGatewayEvent): Promise<ProxyResult> => {
  const event: Event = JSON.parse(e.body)

  /**
   * create github api client
   */
  const github = await createApp({
    id: GITHUB_APP_ID,
    cert: GITHUB_APP_PRIVATE_KEY,
  }).asInstallation(event.installation.id)

  /**
   * read the config
   */
  const config = await readConfig(github, event.repository)

  /**
   * ignore some cases
   */
  if (['rerequested', 'requested'].includes(event.action)) return

  if (event.pull_request.state !== 'open') return

  if (!config.submissionOpen) return

  if (
    !event.pull_request.labels.some(
      ({ name }) => name === config.submissionLabel
    )
  )
    return

  /**
   * prepare the report
   */
  const reportRuns = await createReportRuns(
    github,
    event.pull_request,
    checkNames
  )

  /**
   * read the submission
   */
  const s = await readSubmission(github)(event.pull_request, config)

  /**
   * analyze the submission
   */
  const checks = await analyzeSubmission({ ...event, ...s, github, config })

  /**
   * fire the report
   */
  await reportRuns(checks)

  console.log(checks)
}
