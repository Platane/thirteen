import path from 'path'
import { validateManifestSchema } from '../service/manifestSchema'

export const stepName = 'manifest-read'

export const dependencies = ['read-dir']

export const runName = 'manifest'

export const exec = async ctx => {
  /**
   * get the manifest.json file
   */
  const manifestFile = ctx.files.find(
    ({ filename }) =>
      path.normalize(filename) === path.join(ctx.dir, 'manifest.json')
  )

  /**
   * get the file blob
   */
  const manifestRaw =
    manifestFile &&
    (await ctx.github.gitdata
      .getBlob({
        owner: ctx.owner,
        repo: ctx.repo,
        file_sha: manifestFile.sha,
      })
      .then(({ data: { content } }) => JSON.parse(btoa(content)))
      .catch(() => null))

  /**
   * validate the structure against the schema
   */
  const { value, error } = validateManifestSchema(manifestRaw)

  /**
   * report
   */
  ctx.runResult[runName].results.push(
    {
      success: !!manifestFile,
      label: 'Should contain a manifest.json file',
    },
    {
      success: !!manifestRaw,
      label: 'manifest.json should be a valid json file',
    },
    {
      success: !error,
      label: 'manifest.json should respect the schema',
      details: error.details.map(
        ({ message, path }) => `- ${message}   at [${path.join(', ')}]`
      ),
    }
  )

  return { ...ctx, manifest: value }
}

const btoa = x => Buffer.from(x, 'base64').toString('ascii')
