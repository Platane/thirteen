import test from 'tape'

import { event } from '../__fixtures__/missing-image'

import { handler } from '../index'

test('test missing image', async t => {
  const res = await handler(event)

  const check = res.checks.find(({ key }) => key === 'valid-images')

  t.equal(check.result, 'failure', 'valid-images check should fail')

  t.end()
})
