const userService = require('../../services/users');
const {getUserByID, updateUser, deleteUser} = require('../../services/users');

module.exports.userController = {
    async get(req, res) {
        const {userID} = req.params;
        const user = await getUserByID(userID);
        return res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress
        });
    },
    async put(req, res) {
        res.end()
    },
    async patch(req, res) {
        const {userID} = req.params;
        const newUser = req.body;
        try {
            await updateUser(userID, newUser);
        }
        catch (e) {
            res.status(404).json(`User with ID ${userID} was not found.`)
        }
        res.json();
    },
    async delete(req, res) {
        res.end()
    }
}
module.exports.usersController = {
    async get(req, res) {
        res.end();
    },
    async post(req, res) {
        try {
            await userService.createUser(req.body);
        }
        catch (e) {
            res.status(409).json(`User with email address ${req.body.emailAddress} already exists.`)
        }
        res.status(201).end();
    },
    async delete(req, res) {
        res.end();
    }
}