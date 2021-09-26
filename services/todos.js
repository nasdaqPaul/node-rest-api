const Note = require('../db/models/note')

/*
TODO: There is probably a neater way to query and work with MongoDB arrays
 */

module.exports = {
    async getTodos (userID, noteID) {
        const note = await Note.findOne({_id: noteID, author: userID}).lean()
        if (!note) throw new Error('NoteNotFound');
        return note.todos
    },
    async getTodo (userID, noteID, todoIndex) {
        try {
            const note = await Note.findOne({_id: noteID, author: userID}).lean();
            if (!note) throw 'NoteNotFound';
            if (todoIndex < 0 || todoIndex > note.todos.length) return null;
            return note.todos[todoIndex];
        }
        catch (e) {
            throw new Error('NoteNotFound');
        }
    },
    async deleteTodo (userID, noteID, todoIndex) {
        let note;
        try {
            note = await Note.findOne({_id: noteID, author: userID});
        }
        catch (e) {
            throw new Error('NoteNotFound')
        }
        if(!note) throw new Error('NoteNotFound');
        if(todoIndex < 0 || todoIndex > note.todos.length) throw new Error('TodoNotFound');
        note.todos.splice(todoIndex, 1);
        await note.save();
    },
    async updateTodo (userID, noteID, todoIndex, newTodo) {
        let note;
        try {
            note = await Note.findOne({_id: noteID, author: userID});
        }
        catch (e) {
            throw new Error('NoteNotFound');
        }
        if(!note) throw new Error('NoteNotFound');
        if(todoIndex < 0 || todoIndex > note.todos.length) throw new Error('TodoNotFound');
        if (newTodo.title) note.todos[todoIndex].title = newTodo.title;
        if (newTodo.done !== undefined) note.todos[todoIndex].done = newTodo.done;

        if(note.isModified('todos')) await note.save();
    },
    async replaceTodo (userID, noteID, todoIndex, newTodo) {
        let note;
        try {
            note = await Note.findOne({_id: noteID, author: userID});
        }
        catch (e) {
            throw new Error('NoteNotFound');
        }
        if(!note) throw new Error('NoteNotFound');
        if(todoIndex < 0 || todoIndex > note.todos.length) throw new Error('TodoNotFound');
        note.todos.splice(todoIndex, 1, newTodo);
        await note.save();
    }
}
