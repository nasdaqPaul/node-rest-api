const userService = require('../../services/users');

module.exports.userController = {
    async get(req, res) {
        res.end();
    },
    async put(req, res) {
        res.end()
    },
    async patch(req, res) {
        res.end()
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
        await userService.createUser(req.body);
        res.status(201).end();
    },
    async delete(req, res) {
        res.end();
    }
}