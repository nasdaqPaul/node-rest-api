const jwt = require('jsonwebtoken');
const {json} = require("body-parser");

module.exports = async function (req, res, next) {
    if (
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
        let token = req.headers.authorization.split(' ')[1];
        try {
            const decodedJwt = await jwt.verify(token, "SomethingRandom");
            req.user = {
                id: decodedJwt.id
            }
            next();
        }
        catch (e) {
            console.log(e);
            res.end()
        }
    }
    else {
        res.status(401).json("Authentication Required")
    }

}