import path from 'path'
import { getFiles } from './getFiles'
import { readManifest } from './readManifest'
import { readImageFiles } from './readImageFiles'
import { readBundleFiles } from './readBundleFiles'
import type { PullRequest } from '../../type'

export const readSubmission = github => async (config: *, pr: PullRequest) => {
  const files = await getFiles(github)(pr)

  const manifest = files && (await readManifest(files))

  const bundleFiles =
    files && manifest && (await readBundleFiles(manifest, files))

  const imageFiles =
    files && manifest && (await readImageFiles(manifest, files))

  return {
    files,
    manifest,
    bundleFiles,
    imageFiles,
  }
}
