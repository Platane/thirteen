import fetch from 'node-fetch'

export const readSingleEntryImages = async gameUrl => {
  const spec = {
    small: '/__small.jpg',
    big: '/__big.jpg',
  }

  const images = {}

  await Promise.all(
    Object.keys(spec).map(key =>
      fetch(gameUrl + spec[key])
        .then(x => x.arrayBuffer())
        .then(content => {
          images[key] = {
            content: new Buffer(content),
            ext: '.jpg',
          }
        })
    )
  )

  return images
}
