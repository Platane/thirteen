import test from 'tape'
import { specs } from './specs'
import fetch from 'node-fetch'

export const run = (githubWebhookEndpoint: string) => {
  if (!githubWebhookEndpoint)
    throw new Error('arguments githubWebhookEndpoint missing')

  console.log(`running test against "${githubWebhookEndpoint}"`)

  specs.forEach(({ label, event, check }) =>
    test(label, async t => {
      const res = await fetch(githubWebhookEndpoint, {
        method: 'POST',
        headers: event.headers,
        body: event.body,
      }).then(res => res.json())

      check(t)(res)

      t.end()
    })
  )
}
