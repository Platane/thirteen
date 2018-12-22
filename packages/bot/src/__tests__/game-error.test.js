import test from 'tape'

import { event } from '../__fixtures__/game-error'

import { handler } from '../index'

test('test game error', async t => {
  const res = await handler(event)

  const check = res.checks.find(({ key }) => key === 'game-run')

  t.equal(check.result, 'failure', 'game-run check should fail')

  t.end()
})
