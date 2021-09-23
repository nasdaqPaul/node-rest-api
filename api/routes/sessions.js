const { Router } = require('express')
const validateRequest = require('../middleware/validateRequest')
const { sessionsController, sessionController } = require('../controllers/sessions')
const { sessionsSchema } = require('../schemas/sessions')

const sessionsRouter = Router()
const sessionRouter = Router()

sessionsRouter.post('/', validateRequest(sessionsSchema.POST), sessionsController.post)

sessionRouter.delete('/', sessionController.delete)

module.exports.sessionRouter = sessionRouter
module.exports.sessionsRouter = sessionsRouter
