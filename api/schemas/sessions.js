const Joi = require('joi')

module.exports.sessionsSchema = {
  POST: Joi.object({
    body: Joi.object({
      emailAddress: Joi.string().email().required(),
      password: Joi.string().required()
    }),
    params: Joi.object(),
    query: Joi.object()
  })
}
