import path from 'path'
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
  ctx.runResult[runName].results.push(
    {
      success: !!bundleFile,
      label: `manifest.json should link to a bundle file`,
    },
    {
      success: bundleFile && bundleFile.size <= SIZE_LIMIT,
      label: `bundle size should be less than ${SIZE_LIMIT}o`,
    }
  )

  if (!bundleFile || bundleFile.size > SIZE_LIMIT) return ctx

  /**
   * get the bundle file blob
   */
  const bundleB64 =
    bundleFile &&
    (await ctx.github.gitdata
      .getBlob({
        owner: ctx.owner,
        repo: ctx.repo,
        file_sha: bundleFile.sha,
      })
      .then(({ data: { content } }) => content)
      .catch(() => null))

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
      success: bundleFiles && !!bundleFiles[ctx.manifest.bundle_index],
      label: 'bundle should contain a index file',
    }
  )

  return { ...ctx, bundleFiles }
}
