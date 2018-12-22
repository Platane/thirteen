import test from 'tape'

import { event } from '../__fixtures__/mal-placed'

import { handler } from '../index'

test('test mal placed', async t => {
  const res = await handler(event)

  t.assert(
    !res.checks.every(({ result }) => result === 'success'),
    'at least one test should fail'
  )

  t.end()
})
