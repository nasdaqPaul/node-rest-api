const {Router} = require('express');
const validateRequest = require('../middleware/validateRequest');
const {noteController, notesController} = require('../controllers/notes');
const {noteSchemas, notesSchemas} = require('../schemas/notes');


const noteRouter = Router();
const notesRouter = Router();

noteRouter.get('/:noteID', noteController.get);
noteRouter.put('/:noteID', noteController.put);
noteRouter.patch('/noteID', noteController.patch);
noteRouter.delete('/:noteID', noteController.delete);


notesRouter.get('/', notesController.get);
notesRouter.post('/',validateRequest(notesSchemas.POST), notesController.post);


module.exports.noteRouter = noteRouter;
module.exports.notesRouter = notesRouter;