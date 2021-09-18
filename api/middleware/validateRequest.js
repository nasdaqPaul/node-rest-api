module.exports = function (requestSchema) {
    return async function (req, res, next) {
        try {
            await requestSchema.validateAsync({
                body: req.body,
                query: req.query,
                params: req.params
            }, {abortEarly: false});
            next();
        } catch (validationError) {
            res.status(400).json(validationError.details)
        }
    }
}