import { getFiles } from './source/getFiles'
import http from 'http'
import { parse as parseUrl_ } from 'url'
import { PORT } from './config'

const parseUrl = x => {
  const u = parseUrl_(x)
  return { ...u, pathname: u.pathname || '/' }
}

export const create = () => {
  const files = getFiles()

  const server = http
    .createServer((req, res) => {
      const url = parseUrl(req.url)

      const filename = url.pathname.split('/').slice(-1)[0]

      console.log(filename)

      const file = files.find(x => x.filename === filename)

      if (!file) {
        res.writeHead(404)
        res.end()
        return
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
      })
      res.end(JSON.stringify(file.content))
    })
    .listen((PORT: any), () => console.log(`http://localhost:${PORT}`))

  return () => server.close()
}
