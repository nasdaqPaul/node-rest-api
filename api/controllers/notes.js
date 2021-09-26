const {
    getUserNote,
    createUserNote,
    deleteUserNote,
    replaceUserNote,
    updateUserNote,
    getAllUserNotes
} = require('../../services/notes')

const noteController = {
    async get (req, res) {
        const { noteID } = req.params
        const user = req.user
        const note = await getUserNote(user.id, noteID)
        if (!note) return res.status(404).json(`Note with id ${noteID} was not found`)
        return res.json(note)
    },
    async put (req, res) {
        const { noteID } = req.params
        const user = req.user
        const newNote = req.body
        try {
            await replaceUserNote(user.id, noteID, newNote)
        } catch (e) {
            return res.status(404).json(`User note with id ${noteID} was not found`)
        }
        return res.json()
    },
    async patch (req, res) {
        const { noteID } = req.params
        const user = req.user
        const newNote = req.body
        try {
            await updateUserNote(user.id, noteID, newNote)
        } catch (e) {
            return res.status(404).json(`User note with id ${noteID} was not found`)
        }
        return res.json()
    },
    async delete (req, res) {
        const { noteID } = req.params
        const user = req.user
        try {
            await deleteUserNote(user.id, noteID)
        } catch (e) {
            return res.status(404).json(`User note with id ${noteID} was not found`)
        }
        return res.json()
    }
}
const notesController = {
    async get (req, res) {
        const user = req.user
        const allNotes = await getAllUserNotes(user.id)
        return res.json(allNotes)
    },
    async post (req, res) {
        await createUserNote(req.user.id, req.body)
        return res.status(201).end()
    },
    async delete (req, res) {
        const { noteID } = req.params
        const user = req.user
        return res.end()
    }
}
module.exports.noteController = noteController
module.exports.notesController = notesController
