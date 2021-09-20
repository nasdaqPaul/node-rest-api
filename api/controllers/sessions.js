const {getUserByEmail} = require("../../services/users");
const jwt = require('jsonwebtoken');


async function generateAccessToken(user) {
    return await jwt.sign({
        id: user._id,
        emailAddress: user.emailAddress
    }, "SomethingRandom")
}

module.exports.sessionsController = {
    async post(req, res) {
        const {emailAddress, password} = req.body;
        const user = await getUserByEmail(emailAddress);

        if (!user) res.status(401).json('Invalid username or password');
        if (!await user.checkPassword(password)) res.status(401).json('Invalid username or password');
        let token = await generateAccessToken(user);
        return res.status(200).json({
            accessToken: token
        });
    }
}

module.exports.sessionController = {
    async delete(req, res) {
        res.end();
    }
}