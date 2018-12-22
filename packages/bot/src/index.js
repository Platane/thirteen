import createApp from 'github-app'
import { deploy } from './deploy'
import { setComment } from './comment'
import { readConfig } from './readConfig'
import { readSubmission } from './readSubmission'
import { createReportRuns } from './createReportRuns'
import { analyzeSubmission, checkNames } from './analyzeSubmission'
import { GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY } from './config/github'

import type { APIGatewayEvent, ProxyResult } from 'flow-aws-lambda'

const analyze = async (github, config, pull_request) => {
  if (
    /**
     * submission are marked are closed from the config file
     */
    !config.submissionOpen ||
    /**
     * the purll request does not have the required label
     */
    !pull_request.labels.some(({ name }) => name === config.submissionLabel) ||
    /**
     * the pull request is close
     */
    pull_request.state !== 'open'
  )
    return

  /**
   * prepare the report
   */
  const reportRuns = await createReportRuns(github, pull_request, checkNames)

  /**
   * read the submission
   */
  const s = await readSubmission(github)(config, pull_request)

  const ctx = { github, config, pull_request, ...s }

  /**
   * deploy
   */
  ctx.deploy =
    ctx.files && ctx.manifest && ctx.bundleFiles && (await deploy(ctx))

  /**
   * analyze the submission
   */
  const checks = await analyzeSubmission(ctx)

  /**
   * fire the report
   */
  await reportRuns(checks)

  /**
   * add a comment
   */
  await setComment(github, config, pull_request, ctx, checks)

  return { ctx, checks }
}

const readHeader = (headers, name) =>
  headers[
    Object.keys(headers).find(x => x.toLowerCase() === name.toLowerCase())
  ]

export const handler = async (e: APIGatewayEvent): Promise<ProxyResult> => {
  const githubEventName = readHeader(e.headers, 'X-GitHub-Event')

  const githubEventBody = JSON.parse(e.body)

  console.log('event ', githubEventName, JSON.stringify(githubEventBody))

  /**
   * create github api client
   */
  const github = await createApp({
    id: GITHUB_APP_ID,
    cert: GITHUB_APP_PRIVATE_KEY,
  }).asInstallation(githubEventBody.installation.id)

  /**
   * read the config
   */
  const config = await readConfig(github, githubEventBody.repository)

  console.log('config ', JSON.stringify(config))

  switch (githubEventName) {
    case 'check_suite':
    case 'check_run':
      const [pr] = (
        githubEventBody.check_suite || githubEventBody.check_run
      ).pull_requests

      if (['rerequested', 'requested'].includes(githubEventBody.action) || pr) {
        const [_, owner, repo, number] =
          pr.url.match(/repos\/([^\/]+)\/([^\/]+)\/pulls\/(\d+)/) || []

        const { data: pull_request } = await github.pullRequests.get({
          owner,
          repo,
          number,
        })

        const res = await analyze(github, config, pull_request)

        console.log(JSON.stringify(res && res.checks))

        return res
      }
      break

    case 'pull_request':
      if (['labeled', 'opened', 'edited'].includes(githubEventBody.action)) {
        const res = await analyze(github, config, githubEventBody.pull_request)

        console.log(JSON.stringify(res && res.checks))

        return res
      }
      break
  }
}
