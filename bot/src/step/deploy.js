import path from 'path'
import { upload } from '../service/storage'

export const stepName = 'deploy'

export const dependencies = ['manifest-bundle']

export const runName = 'deploy'

export const exec = async ctx => {
  /**
   * upload files to storage
   */
  let indexUrl
  await Promise.all(
    Object.keys(ctx.bundleFiles).map(async filename => {
      const { _data } = ctx.bundleFiles[filename]

      console.log(ctx.bundleFiles[filename])
      console.log(_data)

      const isIndex =
        path.normalize(filename) === path.normalize(ctx.manifest.bundle_index)

      const key = path.join(ctx.bundleSha, isIndex ? 'index.html' : filename)

      const url = await upload(
        key,
        btoa(_data),
        isIndex ? { ContentType: 'text/html' } : undefined
      )

      if (isIndex) indexUrl = url
    })
  )

  /**
   * report
   */
  ctx.runResult[runName].results.push({
    success: !!indexUrl,
    label: `games deployed [url](${indexUrl || ''})`,
  })

  return ctx
}

const btoa = x => Buffer.from(x, 'base64').toString('ascii')
