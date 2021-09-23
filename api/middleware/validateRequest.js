module.exports = function (requestSchema) {
  return async function (req, res, next) {
    try {
      await requestSchema.validateAsync({
        body: req.body,
        query: req.query,
        params: req.params
      }, { abortEarly: false })
      return next()
    } catch (validationError) {
      return res.status(400).json(validationError.details)
    }
  }
}
