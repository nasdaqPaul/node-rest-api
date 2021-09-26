const { getUserByEmail } = require('../../services/users')
const jwt = require('jsonwebtoken')
const config = require('config')

async function generateAccessToken (user) {
    return await jwt.sign({
        id: user._id,
        emailAddress: user.emailAddress
    }, config.get('jwt.secret'))
}

module.exports.sessionsController = {
    async post (req, res) {
        const { emailAddress, password } = req.body
        const user = await getUserByEmail(emailAddress)

        if (!user) return res.status(401).json('Invalid username or password')
        if (!await user.checkPassword(password)) return res.status(401).json('Invalid username or password')
        const token = await generateAccessToken(user)
        return res.status(200).json({
            accessToken: token
        })
    }
}

module.exports.sessionController = {
    async delete (req, res) {
        res.end()
    }
}
