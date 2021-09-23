const Joi = require('joi')

module.exports.usersSchema = {
  POST: Joi.object({
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      emailAddress: Joi.string().required().email(),
      password: Joi.string().required()
    }),
    params: Joi.object(),
    query: Joi.object()
  })
}
