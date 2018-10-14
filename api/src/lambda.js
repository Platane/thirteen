// import Serve from 'lambda-serve'
//
//
// app.proxy = true
//
// export const handler = Serve(app.callback())

import fs from 'fs'
import serverless from 'serverless-http'
import { SOURCE_PATH } from './config'
import { createApp } from './index'

const entries = JSON.parse(fs.readFileSync(SOURCE_PATH).toString())

const koa = require('koa')

const app = createApp()
// construct your app as normal
// const app = new koa()
// // register your middleware as normal
// app.use(ctx => console.log(ctx))

export const handler = serverless(app)

// export const handler = event => console.log(event, entries)
