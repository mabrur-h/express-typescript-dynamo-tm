import * as Joi from 'joi'

export default Joi.object({
  name: Joi.string()
    .min(2)
    .max(32)
    .required()
    .messages({
      'string.empty': 'Name should be at least 2 symbols',
      'string.min': 'Name should be at least 2 symbols',
      'string.max': 'Name should be maximum 32 symbols',
    }),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
    .messages({
      'string.empty': 'Password should contain one capital letter and a number. It can be minimum 3 maximum 30 symbols.',
    }),
  repeat_password: Joi.string()
    .required()
    .valid(Joi.ref('password')),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .messages({
      'string.empty': 'Only acceptable .com and .net domains',
    })
    .required()
})