const {Router} = require('express');
const {usersController, userController} = require('../controllers/users');
const {usersSchema} = require('../schemas/users')
const validateRequest = require('../middleware/validateRequest');


const userRouter = Router();
const usersRouter = Router();

userRouter.get('/', usersController.get);
userRouter.put('/', userController.put);
userRouter.patch('/', userController.patch);
usersRouter.delete('/', userController.delete);

usersRouter.post('/', validateRequest(usersSchema.POST), usersController.post);


module.exports.usersRouter = usersRouter;
module.exports.userRouter = userRouter;
