const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

function validateEmailAddress (emailAddress) {
    return emailRegEx.test(emailAddress)
}

const userSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    emailAddress: {
        type: String,
        unique: true,
        validate: [validateEmailAddress, '{VALUE} is not a valid email address']
    },
    password: { type: String, required: true }
})

userSchema.methods.hashPassword = async function () {
    this.password = await bcrypt.hash(this.password, 10)
}

userSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = model('User', userSchema)
