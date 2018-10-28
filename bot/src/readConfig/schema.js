import Joi from 'joi'

export const schema = Joi.object().keys({
  submissionOpen: Joi.boolean().default(true),

  submissionLabel: Joi.string().default('submission'),

  submissionDir: Joi.string()
    .uri({ allowRelative: true, relativeOnly: true })
    .default('submission'),

  images: Joi.object().pattern(
    Joi.string(),
    Joi.object().keys({
      width: Joi.number()
        .integer()
        .required(),
      height: Joi.number()
        .integer()
        .required(),
      sizeLimit: Joi.number()
        .integer()
        .default(1000000000),
    })
  ),
})
