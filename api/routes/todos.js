const { Router } = require('express')
const validateRequest = require('../middleware/validateRequest')
const { todoController, todosController } = require('../controllers/todos')
const { todosSchema, todoSchema } = require('../schemas/todos')

const todoRouter = new Router()
const todosRouter = new Router()

todosRouter.get('/:noteID/todos', todosController.get)
todosRouter.post('/:noteID/todos', validateRequest(todosSchema.POST), todosController.post)

todoRouter.get('/:todoIndex', validateRequest(todoSchema.GET), todoController.get)
todoRouter.put('/:todoIndex', validateRequest(todoSchema.PUT), todoController.put)
todoRouter.patch('/:todoIndex', validateRequest(todoSchema.PATCH), todoController.patch)
todoRouter.delete('/:todoIndex', validateRequest(todoSchema.DELETE), todoController.delete)

module.exports.todoRouter = todoRouter
module.exports.todosRouter = todosRouter
