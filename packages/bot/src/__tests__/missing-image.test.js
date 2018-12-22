import test from 'tape'

import { event } from '../__fixtures__/missing-image'

import { handler } from '../index'

test('test missing image', async t => {
  const res = await handler(event)

  t.assert(
    !res.checks.every(({ result }) => result === 'success'),
    'at least one test should fail'
  )

  t.end()
})
