import fs from 'fs'
import { PNG } from 'pngjs'

const forEachColor = ({ width, height, data }) => fn => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2

      fn(data[idx], data[idx + 1], data[idx + 2], data[idx + 3])
    }
  }
}

export const getPngColorDerication = imagePath => {
  const buffer = fs.readFileSync(imagePath)

  const png = PNG.sync.read(buffer)

  const N = png.width * png.height

  let mean = { r: 0, g: 0, b: 0 }
  forEachColor(png)((r, g, b) => {
    mean.r += r
    mean.g += g
    mean.b += b
  })
  mean.r /= N
  mean.g /= N
  mean.b /= N

  let v = 0

  forEachColor(png)((r, g, b) => {
    v += Math.abs(mean.r - r) + Math.abs(mean.g - g) + Math.abs(mean.b - b)
  })

  return v / N
}
