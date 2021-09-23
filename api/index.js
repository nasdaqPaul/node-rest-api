const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const { noteRouter, notesRouter } = require('./routes/notes')
const { userRouter, usersRouter } = require('./routes/users')
const { sessionRouter, sessionsRouter } = require('./routes/sessions')
const { todoRouter, todosRouter } = require('./routes/todos')
const requiresAuthentication = require('./middleware/requiresAuthentication')

const apiRouter = express.Router()

apiRouter.use(bodyParser.json())
apiRouter.use(morgan('dev'))

apiRouter.use('/note/:noteID/todo', requiresAuthentication, todoRouter)
apiRouter.use('/note/:noteID/todos', requiresAuthentication, todosRouter)

apiRouter.use('/note', requiresAuthentication, noteRouter)
apiRouter.use('/notes', requiresAuthentication, notesRouter)

apiRouter.use('/user', userRouter)
apiRouter.use('/users', usersRouter)

apiRouter.use('/session', sessionRouter)
apiRouter.use('/sessions', sessionsRouter)

module.exports = apiRouter
