import path from 'path'

export const readMainDirectory = files => {
  const m = files.find(
    ({ filename }) => filename.split('/').slice(-1)[0] === 'manifest.json'
  )

  return m ? path.dirname(m.filename) : '.'
}
