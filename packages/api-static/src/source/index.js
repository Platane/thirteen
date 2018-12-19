import { buildFiles } from './buildFiles'
import { readEntries } from './readEntries'
export { readEntries } from './readEntries'

export const getFiles = () => buildFiles(readEntries())
