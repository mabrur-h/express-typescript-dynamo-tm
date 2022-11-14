import * as Joi from 'joi'

export default Joi.object({
  verificationCode: Joi.number()
    .min(10000)
    .max(99999)
    .required()
    .messages({
      'number.min': 'Value should be at least 10000',
      'number.max': 'Value should be maximum 99999',
    }),
})