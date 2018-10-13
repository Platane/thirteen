import test from 'tape'

import '../service/manifestSchema/__tests__/validateManifestSchema.test'

import { event } from '../__fixtures__'

import { handler } from '../index'

test(' -- ', async t => {
  await handler(event)

  t.end()
})
