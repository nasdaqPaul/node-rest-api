const Note = require('../db/models/note');


module.exports = {
    async createUserNote(userID, note) {
        try {
            await Note.create({
                author: userID,
                ...note
            })
        } catch (e) {
            throw new Error('UserDoesNotExist')
        }
    },
    async deleteUserNote(userID, noteID) {
        await Note.deleteOne({author: userID, _id: noteID}).then(results => {
            if (results.deletedCount === 0) throw new Error('NoteNotFound');
        });
    },
    async getUserNote(userID, noteID) {
        try {
            return await Note.findOne({_id: noteID, author: userID}).lean();
        } catch (e) {
            return null
        }
    },
    async getAllUserNotes(userID) {
        return Note.find({author: userID}).lean();
    },
    async replaceUserNote(userID, noteID, newNote) {
        await Note.replaceOne({author: userID, _id: noteID,}, {...newNote, author: userID}).then(results => {
            if (results.matchedCount === 0) throw new Error('NoteNotFound');
        })
    },
    async updateUserNote(userID, noteID, newNote) {
        await Note.findOneAndUpdate({author: userID, _id: noteID}, {...newNote, author: userID}).then(results => {
            if (results.matchedCount === 0) throw new Error('NoteNotFound');
        })
    }
}