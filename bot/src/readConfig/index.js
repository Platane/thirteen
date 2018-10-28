import YAML from 'yaml'
import { schema } from './schema'
import { decodeBase64 } from '../util/base64'

export const readConfig = async (github, repo) => {
  const q = [
    `repo:${repo.full_name}`,
    'path:/',
    'filename:.thirteen-bot.yml',
  ].join(' ')

  const {
    data: { items },
  } = await github.search.code({ q })

  if (!items[0]) return schema.validate({})

  const {
    data: { content },
  } = await github.gitdata.getBlob({
    owner: repo.owner.login,
    repo: repo.name,
    file_sha: items[0].sha,
  })

  const raw = YAML.parse(decodeBase64(content))

  return schema.validate(raw || {})
}
