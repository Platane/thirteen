import '../service/manifestSchema/__tests__/validateManifestSchema.test'

import test from 'tape'
import { specs } from './specs'
import { handler } from '../index'

specs.forEach(({ label, event, check }) =>
  test(label, async t => {
    check(t)(await handler(event))

    t.end()
  })
)
