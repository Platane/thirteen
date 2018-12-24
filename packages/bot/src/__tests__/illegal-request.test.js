import test from 'tape'

import { event } from '../__fixtures__/illegal-request'

import { handler } from '../index'

test('test illegal request', async t => {
  const res = await handler(event)

  const check = res.checks.find(({ key }) => key === 'game-run')

  const checkFailed = check.result === 'failure'
  const checkWarning = check.detail.includes('⚠️')

  t.assert(
    checkFailed || checkWarning,
    'game-run check should fail, or at least display a warning'
  )

  t.end()
})
