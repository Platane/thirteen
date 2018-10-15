import fs from 'fs'
import serverless from 'serverless-http'
import { SOURCE_PATH } from './config'
import { createApp } from './index'

const entries = JSON.parse(fs.readFileSync(SOURCE_PATH).toString())

const koa = require('koa')

const app = createApp()

const headers = {
  'Content-Type': 'application/json',
  'access-control-allow-headers': 'Content-Type,Authorization,X-Api-Key',
  'access-control-allow-methods': 'OPTIONS,GET,PUT',
  'access-control-allow-origin': '*',
}

export const handler = serverless(app, {
  response: (response, event, context) => {
    response.headers = { ...(response.headers || {}), ...headers }
  },
})
