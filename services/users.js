const User = require('../db/models/user');

module.exports = {
    async createUser(user) {
        let newUser = new User(user);
        await newUser.hashPassword();
        try {
            await newUser.save();
        }
        catch (e) {
            throw new Error('UserExists');
        }
    },
    async getUserByID(userID) {

    },
    async getUserByEmail(emailAddress) {
        try {
            return await User.findOne({emailAddress: emailAddress})
        } catch (e) {
            console.log(e);
            return null;
        }
    },
    async deleteUser(userID) {

    }
}