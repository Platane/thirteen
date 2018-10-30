import { APP_NAME } from '../config/github'

const createOrEditComment = async (github, pr, body) => {
  const { data: comments } = await github.issues.getComments({
    owner: pr.base.repo.owner.login,
    repo: pr.base.repo.name,
    number: pr.number,
    per_page: 100,
  })

  const comment = comments.find(({ user }) => user.login === `${APP_NAME}[bot]`)

  if (!comment)
    await github.issues.createComment({
      owner: pr.base.repo.owner.login,
      repo: pr.base.repo.name,
      number: pr.number,
      body,
    })
  else
    await github.issues.editComment({
      owner: pr.base.repo.owner.login,
      repo: pr.base.repo.name,
      comment_id: comment.id,
      body,
    })
}

export const setComment = (github, config, pr, checks, deployRes) =>
  createOrEditComment(github, pr, buildBody(config, pr, checks, deployRes))

const buildBody = (config, pr, checks, deployRes) => {
  const body = [
    `__Hi ${pr.user.login} :wave:__`,
    'Thanks for your participation !',
    '',
    'I am the verification bot, I have reviewed your submission.',
    '',
  ]

  const passCheck = !checks.some(({ result }) => result === 'failure')
  const passImageCheck = checks.some(
    ({ key, result }) => key === 'valid-images' && result !== 'failure'
  )
  const passDeploy = !!deployRes

  if (passCheck)
    body.push(
      'Every thing seems alright ! :thumbsup:',
      'A human will do a last verification soon.',
      ''
    )

  if (passCheck && passDeploy)
    body.push(
      `In the meantime, please ensure that everything is working well. I have set up a [preview page](${
        deployRes.entryUrl
      }) for you.`,
      ''
    )

  if (!passCheck)
    body.push(
      ':warning: There is still some issues that you should look after.',
      'Take a look at the [automated test reports](#partial-pull-merging) below.',

      config.reviewers.length
        ? `Don't hesitate to ask some help by mentioning one of those guys ${config.reviewers
            .map(x => `@${x}`)
            .join(' ')}`
        : '',
      ''
    )

  if (
    passImageCheck &&
    deployRes &&
    deployRes.imageUrls &&
    Object.keys(deployRes.imageUrls)[0]
  )
    body.push(
      'Those are the images that will be used for your game:',
      Object.keys(deployRes.imageUrls)
        .sort()
        .map(
          key =>
            `[![image ${key}](${deployRes.imageUrls[key]})](${
              deployRes.imageUrls[key]
            })`
        )
        .join(' ')
    )

  if (!passCheck)
    body.push(
      '',
      '',
      '_I will update this message as soon as you do any modification._'
    )

  return body.join('\n')
}
