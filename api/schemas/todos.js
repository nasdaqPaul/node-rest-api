const Joi = require('joi')

const todosSchema = {
    POST: Joi.object({
        body: Joi.object({
            title: Joi.string().required(),
            done: Joi.boolean().default(false)
        }),
        params: Joi.object({}),
        query: Joi.object({})
    })
}
const todoSchema = {
    GET: Joi.object({
        params: Joi.object({
            todoIndex: Joi.number().required()
        }),
        body: Joi.object(),
        query: Joi.object()
    }),
    PUT: Joi.object({
        body: Joi.object({
            title: Joi.string().required(),
            done: Joi.boolean().default(false)
        }),
        params: Joi.object({
            todoIndex: Joi.number().required()
        }),
        query: Joi.object()
    }),
    PATCH: Joi.object({
        params: Joi.object({
            todoIndex: Joi.number().required()
        }),
        body: Joi.object({
            title: Joi.string(),
            done: Joi.boolean().default(false)
        }),
        query: Joi.object()
    }),
    DELETE: Joi.object({
        params: Joi.object({
            todoIndex: Joi.number().required()
        }),
        body: Joi.object(),
        query: Joi.object()
    })
}

module.exports.todoSchema = todoSchema
module.exports.todosSchema = todosSchema
