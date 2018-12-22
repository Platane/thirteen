import test from 'tape'

import { event } from '../__fixtures__/invalid-image'

import { handler } from '../index'

test('test invalid image', async t => {
  const res = await handler(event)

  const check = res.checks.find(({ key }) => key === 'valid-images')

  t.equal(check.result, 'failure', 'valid-images check should fail')

  t.end()
})
