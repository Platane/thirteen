import path from 'path'
import { upload } from '../service/storage'
import { render } from './render'
import { readBundleSha } from '../readSubmission/readBundleSha'

export const deploy = async ctx => {
  const sha = readBundleSha(ctx.files, ctx.manifest)
  const slug = `submission/${sha}`

  const indexFile = ctx.bundleFiles.find(
    ({ filename }) => filename === (ctx.manifest.bundle_index || 'index.html')
  )

  /**
   * upload images
   */
  const imageUrls = {}
  await Promise.all(
    Object.keys(ctx.imageFiles || {}).map(key =>
      upload(
        `entry/${slug}/images/${key}${path.extname(
          ctx.imageFiles[key].filename
        )}`,
        Buffer.from(ctx.imageFiles[key].content, 'base64'),
        { ContentType: 'image/*' }
      ).then(url => (imageUrls[key] = url))
    )
  )

  /**
   * upload game and game assets
   */
  const [gameUrl] = await Promise.all([
    upload(
      `entry/${slug}/game/index.html`,
      Buffer.from(indexFile.contentBuffer),
      {
        ContentType: 'text/html',
      }
    ),

    ...ctx.bundleFiles
      .filter(x => x !== indexFile)
      .map(({ filename, contentBuffer }) =>
        upload(`entry/${slug}/game/${filename}`, Buffer.from(contentBuffer))
      ),
  ])

  /**
   * upload renderer entry page
   * note that when visiting this page, it will try to required js script from the root url
   */
  const entryUrl = await upload(
    `entry/${slug}/index.html`,
    render(slug, { ...ctx.manifest, image: imageUrls, gameUrl }),
    { ContentType: 'text/html' }
  )

  return {
    imageUrls,

    /**
     * use the website url instead of the static one
     * because it handles redirections
     */
    entryUrl: entryUrl.replace('.s3.', '.s3-website-').replace('https', 'http'),
    gameUrl,
  }
}
