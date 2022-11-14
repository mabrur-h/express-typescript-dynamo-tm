import * as Joi from 'joi'

export default Joi.object({
  title: Joi.string()
    .min(2)
    .max(64)
    .required()
    .messages({
      'string.empty': 'Title should be at least 2 symbols',
      'string.min': 'Title should be at least 2 symbols',
      'string.max': 'Title should be maximum 64 symbols',
    }),
})