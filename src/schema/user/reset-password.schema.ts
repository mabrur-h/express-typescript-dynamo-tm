import * as Joi from 'joi'

export default Joi.object({
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
    .messages({
      'string.empty': 'Password should contain one capital letter and a number. It can be minimum 3 maximum 30 symbols.',
    }),
  passwordResetCode: Joi.number()
    .min(10000)
    .max(99999)
    .required()
    .messages({
      'number.min': 'Value should be at least 10000',
      'number.max': 'Value should be maximum 99999',
    }),
})