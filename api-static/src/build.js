import fs from 'fs'
import path from 'path'
import { getFiles } from './source/getFiles'
import { BUILD_DIR } from './config'

getFiles().forEach(({ filename, content }) =>
  fs.writeFileSync(path.resolve(BUILD_DIR, filename), JSON.stringify(content))
)
