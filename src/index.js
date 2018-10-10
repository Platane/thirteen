import debug from 'debug'
import createApp from 'github-app'
import { sortDependencyGraph } from './service/graph/topologicalSorting'
import { GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY } from './config/github'
import { LABEL_NAME } from './config'

import type { APIGatewayEvent, ProxyResult } from 'flow-aws-lambda'
import type { Event, File } from './type'

const originalSteps = [
  require('./step/manifest-bundle'),
  require('./step/manifest-read'),
  require('./step/read-dir'),
  require('./step/deploy'),
]

const extractRunNames = steps => [
  ...new Set(steps.map(s => s.runName).filter(Boolean)),
]

const formatOutput = runName => ({ results }) => ({
  title: '',
  summary: results
    .map(({ success, label, details }) => {
      return [
        '-',
        success ? '✓' : '×',
        label,

        details ? ('\n' + details).replace(/\n/g, '\n  >') : '',
      ].join(' ')
    })
    .join('\n'),
})

const execSteps = github => async event => {
  const steps = sortDependencyGraph(
    originalSteps.map(x => ({ ...x, id: x.stepName }))
  )

  /**
   * parse event
   */
  const owner = event.repository.owner.login
  const repo = event.repository.name
  const pull_request_number = event.number
  const commit_sha = event.pull_request.head.sha

  /**
   * create the runs
   */
  const runResult = {}
  const runId = {}
  await Promise.all(
    extractRunNames(steps).map(async runName => {
      const { data } = await github.checks.create({
        owner,
        repo,
        name: runName,
        head_sha: commit_sha,
        status: 'queued',
      })

      runResult[runName] = { results: [] }
      runId[runName] = data.id
    })
  )

  /**
   * prepare context
   */
  let ctx = {
    github,
    owner,
    repo,
    commit_sha,
    pull_request_number,
    event,
    runResult,
  }

  /**
   * exec loop
   */
  while (steps.length) {
    const { exec, runName } = steps.shift()

    /**
     * update check run to pending
     */
    github.checks.update({
      owner,
      repo,
      check_run_id: runId[runName],
      status: 'in_progress',
    })

    ctx = await exec(ctx)

    const lastStepFromTheRun = !steps.some(s => s.runName === runName)
    const failure = ctx.runResult[runName].results.some(
      ({ success }) => !success
    )

    /**
     * if the step fails,
     * stop running the other steps
     * close all remaining runs
     */
    if (failure) {
      await Promise.all(
        extractRunNames([...steps, { runName }]).map(runName =>
          github.checks.update({
            owner,
            repo,
            check_run_id: runId[runName],
            completed_at: new Date().toISOString(),
            status: 'completed',
            conclusion: 'failure',
            output: formatOutput(runName)(runResult[runName]),
          })
        )
      )

      break
    }

    /**
     * update check
     */
    if (lastStepFromTheRun)
      await github.checks.update({
        owner,
        repo,
        check_run_id: runId[runName],
        completed_at: new Date().toISOString(),
        status: 'completed',
        conclusion: 'success',
        output: formatOutput(runName)(runResult[runName]),
      })
  }

  console.log(JSON.stringify(runResult, null, 2))
}

export const handler = async (e: APIGatewayEvent): Promise<ProxyResult> => {
  const event: Event = JSON.parse(e.body)

  console.log(event)

  /**
   * ignore some cases
   */
  if (event.pull_request.state !== 'open') return

  if (!event.pull_request.labels.some(({ name }) => name === LABEL_NAME)) return

  /**
   * create github api client
   */
  const github = await createApp({
    id: GITHUB_APP_ID,
    cert: GITHUB_APP_PRIVATE_KEY,
  }).asInstallation(event.installation.id)

  /**
   * exec all the steps
   */
  await execSteps(github)(event)
}
