import { create } from '@thirteen/api-static/src'

const run = async () => {
  const { close, url } = await create({ silent: true })

  process.env.STATIC_ENDPOINT = url

  const { writeAllPages } = require('./build/writeAllPages')
  await writeAllPages()

  await close()
}

run()
