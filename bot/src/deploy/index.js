import path from 'path'
import { upload } from '../service/storage'
import { render } from './render'
import { readBundleSha } from '../readSubmission/readBundleSha'

export const deploy = async ctx => {
  const sha = readBundleSha(ctx.files, ctx.manifest)
  const slug = `submission/${sha}`

  const indexFile = ctx.bundleFiles.find(
    ({ filename }) => ctx.manifest.bundle_index || 'index.html'
  )

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

  const [gameUrl] = await Promise.all([
    upload(`entry/${slug}/game/index.html`, Buffer.from(indexFile.content), {
      ContentType: 'text/html',
    }),

    ...ctx.bundleFiles
      .filter(x => x !== indexFile)
      .map(({ filename, content }) =>
        upload(`entry/${slug}/game/${filename}`, Buffer.from(content, 'base64'))
      ),
  ])

  const entryUrl = await upload(
    `entry/${slug}/index.html`,
    render(slug, { ...ctx.manifest, image: imageUrls, gameUrl }),
    { ContentType: 'text/html' }
  )

  return {
    imageUrls,
    entryUrl,
    gameUrl,
  }
}
