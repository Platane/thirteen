const {
  github: { GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY },
} = require('./config')

import type { APIGatewayEvent, ProxyResult } from 'flow-aws-lambda'
import type { Event, File } from './type'

const debug = require('debug')

const createApp = require('github-app')

const tasks = {
  manifest: require('./check/manifest'),
  deploy: require('./check/deploy'),
  exec: require('./check/exec'),
  // images: require('./check/images'),
}

const execTask = taskname => event => tasks[taskname].handler(event)

export const handler = async (e: APIGatewayEvent): Promise<ProxyResult> => {
  const event: Event = JSON.parse(e.body)

  // if (event.pull_request.state !== 'open') return
  //
  // if (!event.pull_request.labels.some(({ name }) => name === LABEL_NAME)) return

  const github = await createApp({
    id: GITHUB_APP_ID,
    cert: GITHUB_APP_PRIVATE_KEY,
  }).asInstallation(event.installation.id)

  const owner = event.repository.owner.login
  const repo = event.repository.name
  const pull_request_number = event.number
  const commit_sha = event.pull_request.head.sha

  const {
    data: { check_runs },
  } = await github.checks.listForRef({ owner, repo, ref: commit_sha })

  Promise.all(
    Object.keys(tasks)

      // if the run already exists for this commit, don't recreate it
      // .filter(
      //   taskname =>
      //     !check_runs.some(
      //       run => run.app.id === GITHUB_APP_ID && run.name === taskname
      //     )
      // )

      // create a test run for every task
      // exec the task
      .map(async taskname => {
        const {
          data: { id },
        } = await github.checks.create({
          owner,
          repo,
          name: taskname,
          head_sha: commit_sha,
          status: 'queued',
        })

        execTask(taskname)({
          installation_id: event.installation.id,
          check_run_id: id,
          pull_request_number,
          owner,
          repo,
          head: event.pull_request.head,
          base: event.pull_request.base,
        })
      })
  )
}
