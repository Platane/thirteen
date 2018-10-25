import crypto from 'crypto'

export const computeSha = buffer => {
  const shasum = crypto.createHash('sha1')
  shasum.update(buffer)
  return shasum.digest('hex')
}
