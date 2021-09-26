const User = require('../db/models/user')

module.exports = {
    async createUser (user) {
        const newUser = new User(user)
        await newUser.hashPassword()
        try {
            await newUser.save()
        } catch (e) {
            throw new Error('UserAlreadyExists')
        }
    },
    async getUserByID (userID) {
        try {
            return await User.findById(userID)
        } catch (e) {
            console.log(e)
            return null
        }
    },
    async getUserByEmail (emailAddress) {
        return User.findOne({ emailAddress: emailAddress })
    },
    async deleteUser (userID) {
        await User.deleteOne({
            _id: userID
        }).then(resutls => {
            if (resutls.deletedCount === 0) throw new Error('UserNotFound')
        })
    },
    async updateUser (userID, newUser) {
        await User.findByIdAndUpdate(userID, {
            ...newUser,
            _id: userID
        }).then(results => {
            if (results.matchedCount === 0) throw new Error('UserNotFound')
        })
    }
}
