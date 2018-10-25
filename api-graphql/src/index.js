import koa from 'koa'
import koaRouter from 'koa-router'
import koaCors from 'koa2-cors'
import corsError from 'koa2-cors-error'
import initRoutes from './graphql'
import { PORT } from './config'

const logError = err => console.log(err)

export const createApp = () => {
  const app = new koa()

  app.context.logError = logError

  const router = new koaRouter()

  initRoutes(router)

  app.use(
    koaCors({
      origin: '*',
      headers: ['Authorization', 'Content-Type'],
      methods: ['GET', 'POST', 'OPTIONS'],
    })
  )
  app.use(corsError())
  app.use(router.routes())
  app.use(router.allowedMethods())
  app.on('error', logError)

  return app
}

export const create_ = async () => {
  const server = createApp().listen(PORT)

  return () => server.close()
}

export const create = () =>
  create_().catch(err => {
    logError(err)
    throw err
  })
