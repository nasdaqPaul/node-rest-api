const Note = require('../db/models/note');

module.exports = {
    async createUserNote(userID, note) {
        await Note.create({
            author: userID,
            ...note
        })
    },
    async deleteUserNote(userID, noteID) {
        return Note.findOneAndDelete({
            _id: noteID,
            author: userID
        }).lean();
    },
    async getUserNote(userID, noteID) {
        try {
            return await Note.findOne({
                _id: noteID,
                author: userID
            }).lean();
        } catch (e) {
            return null
        }
    }
}