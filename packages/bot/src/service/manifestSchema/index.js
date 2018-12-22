import Joi from 'joi'

const schema = categories =>
  Joi.object().keys({
    title: Joi.string()
      .max(100)
      .required(),

    description: Joi.string()
      .max(1000)
      .required(),

    github_repository: Joi.string()
      .uri({ allowRelative: true })
      .required(),

    postmortem_url: Joi.string().uri({
      scheme: [/https?/],
    }),

    categories: Joi.array()
      .items(
        Joi.string()
          .lowercase()
          .insensitive()
          .valid(categories)
      )
      .required(),

    images: Joi.object()
      .keys({
        big: Joi.string()
          .uri({ allowRelative: true, relativeOnly: true })
          .required(),
        small: Joi.string()
          .uri({ allowRelative: true, relativeOnly: true })
          .required(),
      })
      .required(),

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
            website: Joi.string().uri({
              scheme: [/https?/],
            }),
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

type Context = {
  categories: string[],
  github_user_login?: string,
}
export const validateManifestSchema = (o, context: Context = {}) =>
  schema(context.categories || []).validate(o, { context, abortEarly: false })
