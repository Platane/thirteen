import { getFiles } from './source'
import http from 'http'
import { parse as parseUrl_ } from 'url'
import { PORT } from './config'

const parseUrl = x => {
  const u = parseUrl_(x)
  return { ...u, pathname: u.pathname || '/' }
}

const headers = {
  'Content-Type': 'application/json',
  'access-control-allow-headers': 'Content-Type,Authorization,X-Api-Key',
  'access-control-allow-methods': 'OPTIONS,GET,PUT',
  'access-control-allow-origin': '*',
}

export const create = ({ silent } = {}) =>
  new Promise(resolve => {
    const files = getFiles()

    const server = http
      .createServer((req, res) => {
        const url = parseUrl(req.url)

        const filename = url.pathname.split('/').slice(-1)[0]

        if (!silent) console.log(filename)

        const file = files.find(x => x.filename === filename)

        if (!file) {
          res.writeHead(404)
          res.end()
          return
        }

        res.writeHead(200, headers)
        res.end(JSON.stringify(file.content))
      })
      .listen((PORT: number), () => {
        const url = `http://localhost:${PORT}`
        resolve({ url, close })
      })

    const close = () => server.close()
  })
