import test from 'tape'
import { readEntries } from '../source/readEntries'

test('read entries', async t => {
  const entries = await readEntries()

  t.pass('should at least not crash')

  t.end()
})
