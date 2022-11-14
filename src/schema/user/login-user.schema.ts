import * as Joi from 'joi'

export default Joi.object({
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
    .messages({
      'string.empty': 'Password should contain one capital letter and a number. It can be minimum 3 maximum 30 symbols.',
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .messages({
      'string.empty': 'Only acceptable .com and .net domains',
    })
    .required()
})