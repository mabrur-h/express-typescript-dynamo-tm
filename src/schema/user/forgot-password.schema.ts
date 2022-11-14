import * as Joi from 'joi'

export default Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .messages({
      'string.empty': 'Only acceptable .com and .net domains',
    })
    .required()
})