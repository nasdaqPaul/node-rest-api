const Note = require('../db/models/note');

module.exports = {
    async createUserNote(userID, note) {
        try {
            await Note.create({
                author: userID,
                ...note
            })
        }catch (e) {
            throw new Error('UserDoesNotExist')
        }
    },
    async deleteUserNote(userID, noteID) {
        await Note.deleteOne({_id: noteID, author: userID});
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
    },
    async replaceUserNote(userID, noteID, newNote) {
        try {
            await Note.findOneAndReplace({
                _id: noteID,
                author: userID
            },{
                ...newNote,
                author: userID
            });
        }
        catch (e) {
            throw new Error('UserDoesNotExist');
        }
    },
    async updateUserNote(userID, noteID, newNote){
        try {
            Note.findOneAndUpdate({
                author: userID,
                _id: noteID
            }, newNote)
        }catch (e) {
            console.log(e);
            throw new Error('NoteDoesNoteExist')
        }
    }
}