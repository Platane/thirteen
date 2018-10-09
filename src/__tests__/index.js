import test from 'tape'

import '../check/manifest/__tests__/schema.test'

import { event } from '../__fixtures__'

import { handler } from '../index'

test(' -- ', async t => {
  await handler(event)

  t.end()
})
