export const encodeBase64 = (x: string) => new Buffer(x).toString('base64')
export const decodeBase64 = (x: string) =>
  new Buffer(x, 'base64').toString('ascii')
