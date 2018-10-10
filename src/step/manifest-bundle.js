import path from 'path'
import Zip from 'node-zip'
import { SIZE_LIMIT } from '../config'

export const stepName = 'manifest-bundle'

export const dependencies = ['manifest-read']

export const runName = 'manifest'

export const exec = async ctx => {
  /**
   * get the bundle file
   */
  const bundleFile = ctx.files.find(
    ({ filename }) =>
      path.normalize(filename) === path.join(ctx.dir, ctx.manifest.bundle_path)
  )

  /**
   * report
   */
  ctx.runResult[runName].results.push({
    success: !!bundleFile,
    label: `manifest.json should link to a bundle file`,
  })

  if (!bundleFile) return ctx

  /**
   * get the bundle file blob
   */
  const {
    data: { content: bundleB64, size },
  } =
    bundleFile &&
    (await ctx.github.gitdata
      .getBlob({
        owner: ctx.owner,
        repo: ctx.repo,
        file_sha: bundleFile.sha,
      })
      .catch(() => null))

  /**
   * report
   */
  ctx.runResult[runName].results.push({
    success: size <= SIZE_LIMIT,
    label: `bundle size should be less than ${SIZE_LIMIT}o`,
    details: `bundle size is ${size}o`,
  })
  if (size > SIZE_LIMIT) return ctx

  /**
   * unzip the bundle
   */
  let bundleFiles
  try {
    const zip = Zip(bundleB64, { base64: true, checkCRC32: true })
    bundleFiles = zip.files
  } catch (err) {}

  /**
   * report
   */
  ctx.runResult[runName].results.push(
    {
      success: !!bundleFiles,
      label: 'bundle should be a valid zip file',
    },
    {
      success:
        bundleFiles &&
        Object.keys(bundleFiles).some(
          x => path.normalize(ctx.manifest.bundle_index) === path.normalize(x)
        ),
      label: 'bundle should contain a index file',
      details:
        `according to the manifest, the index is named ${
          ctx.manifest.bundle_index
        } \nfound: \n` + Object.keys(bundleFiles).join('\n'),
    }
  )

  return { ...ctx, bundleSha: bundleFile.sha, bundleFiles }
}
