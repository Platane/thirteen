import Joi from 'joi'

export const schema = Joi.object().keys({
  title: Joi.string()
    .max(100)
    .required(),

  description: Joi.string()
    .max(1000)
    .required(),

  github_repository: Joi.string()
    .uri({ allowRelative: true })
    .required(),

  postmortem_url: Joi.string().uri({ allowRelative: true }),

  authors: Joi.array()
    .items(
      Joi.object()
        .keys({
          name: Joi.string(),
          github: Joi.string()
            .trim()
            .replace(/^@/, ''),
          twitter: Joi.string()
            .trim()
            .replace(/^@/, ''),
          email: Joi.string().email(),
        })
        .or('name', 'twitter', 'github')
    )
    .default(
      (context = {}) =>
        context.github_user_login
          ? [{ github: context.github_user_login }]
          : [],
      'pull request author'
    )
    .min(1),
  bundle_path: Joi.string()
    .uri({ allowRelative: true, relativeOnly: true })
    .default('./bundle.zip'),

  bundle_index: Joi.string()
    .uri({ allowRelative: true, relativeOnly: true })
    .default('./index.html'),
})

export const validateSchema = (o, context) => schema.validate(o, { context })
