const {Schema, model} = require('mongoose');
const User = require('./user');

async function validateAuthorID(userId) {
    return await User.exists({_id: userId})
}

const noteSchema = new Schema({
    author: {type: Schema.Types.ObjectId, required: true, ref: 'User', validate: [validateAuthorID, 'User with ID {VALUE} does not exist']},
    title: {type: String},
    content: {type: String},
    favourite: {type: Boolean, default: false},
    images: [String],
    todos: [
        {title: String, completed: {type: Boolean, default: false}}
    ]
}, {
    timestamps: {
        updatedAt: 'updatedAt'
    }
})

module.exports = model('Note', noteSchema);