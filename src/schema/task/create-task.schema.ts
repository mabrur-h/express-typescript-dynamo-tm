import * as Joi from 'joi'

export default Joi.object({
  title: Joi.string()
    .min(2)
    .max(64)
    .required()
    .messages({
      'string.empty': 'Name should be at least 2 symbols',
      'string.min': 'Name should be at least 2 symbols',
      'string.max': 'Name should be maximum 64 symbols',
    }),
  description: Joi.string()
    .min(1)
    .max(256)
    .required()
    .messages({
      'string.empty': 'Name should be at least 1 symbols',
      'string.min': 'Name should be at least 1 symbols',
      'string.max': 'Name should be maximum 256 symbols',
    }),
})