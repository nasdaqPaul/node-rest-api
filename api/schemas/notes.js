const Joi = require('joi');

const todoSchema = Joi.object({
    title: Joi.string().required(),
    completed: Joi.boolean().default(false)
})

const notesSchemas = {
    POST: Joi.object({
        body: Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
            favourite: Joi.boolean().default(false),
            images: Joi.array().items(Joi.string()),
            todos: Joi.array().items(todoSchema)
        }),
        params: Joi.object(),
        query: Joi.object()
    })
}

module.exports.notesSchemas = notesSchemas;