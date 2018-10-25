import fs from 'fs'
import path from 'path'
import koaBody from 'koa-bodyparser'
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
import { schema } from './schema'
import { SOURCE_PATH, APP_BASENAME } from '../config'

const entries = JSON.parse(fs.readFileSync(SOURCE_PATH).toString())

export default router => {
  const graphqlMiddleware = graphqlKoa(ctx => ({
    schema,
    formatError: ctx.logError,
    context: {
      ...ctx,
      entries,
    },
  }))

  router.options('/graphql', () => (ctx.body = 'ok'))
  router.post('/graphql', koaBody(), graphqlMiddleware)
  router.get('/graphql', graphqlMiddleware)

  router.get(
    '/graphiql',
    graphiqlKoa({ endpointURL: APP_BASENAME + 'graphql' })
  )
}
