import test from 'tape'
import { create } from '../index'

test('read entries', async t => {
  const { url, close } = await create()

  t.pass('should at least not crash')

  const index = await fetch(url + '/index.json').then(x => x.json())

  t.assert(index, 'should serve a index.json file')

  await close()

  t.end()
})
