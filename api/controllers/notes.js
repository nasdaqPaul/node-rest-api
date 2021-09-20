const {getUserNote, createUserNote, deleteUserNote, replaceUserNote} = require("../../services/notes");

const noteController = {
    async get(req, res) {
        const {noteID} = req.params;
        const user = req.user;

        const note = await getUserNote(user.id, noteID);
        if (!note) {
            return res.status(404).json(`Note with id ${noteID} was not found`);
        }
        return res.json(note);
    },
    async put(req, res) {
        const {noteID} = req.params;
        const user = req.user;
        const newNote = req.body;

        try {
            await replaceUserNote(user.id, noteID, newNote);
        }
        catch (e) {
            return res.status(404).json(`User note with id ${noteID} was not found`);
        }
        return res.json();
    },
    async patch(req, res) {
        res.send()
    },
    async delete(req, res) {
        const {noteID} = req.params;
        const user = req.user;

        let note = await deleteUserNote(user.id, noteID);
        if (!note) {
            return res.status(404).json(`Note with ID ${noteID} was not found`)
        }
        return res.end()
    }
}
const notesController = {
    async get(req, res) {
        res.end();
    },
    async post(req, res) {
        await createUserNote(req.user.id, req.body);
        return res.status(201).end();
    },
    async delete(req, res) {
        const {noteID} = req.params;
        const user = req.user;

        deleteUserNote()
        res.end()
    }
}
module.exports.noteController = noteController;
module.exports.notesController = notesController;