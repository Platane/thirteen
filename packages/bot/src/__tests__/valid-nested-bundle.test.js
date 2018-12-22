import test from 'tape'

import { event } from '../__fixtures__/valid-nested-bundle'

import { handler } from '../index'

test('test valid with nested bundle', async t => {
  const res = await handler(event)

  t.assert(
    res.checks.every(({ result }) => result === 'success'),
    'all checks should be green'
  )

  t.end()
})
