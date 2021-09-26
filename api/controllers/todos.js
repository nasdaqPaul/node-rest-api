const {getTodo, replaceTodo, getTodos} = require("../../services/todos");
module.exports.todoController = {
    async get (req, res) {
        const user = req.user;
        const {noteID, todoIndex} = req.params;
        try {
            const todo = getTodo(user.id, noteID, todoIndex);
            return res.json(todo);
        }
        catch (e) {
            return res.status(404).json(`Note with ID ${noteID}`);
        }

    },
    async put (req, res) {
        const user = req.user;
        const {noteID, todoIndex} = req.params;
        const newNote = req.body;

        try {
            await replaceTodo(user.id, noteID, todoIndex, newNote);
            return res.send();
        }
        catch (e) {
            if(e.message === 'NoteNotFound') return res.status(404).json(`Note with ID ${noteID} was not found`);
            if(e.message === 'TodoNotFound') return res.status(404).json('Invalid ToDo index');
            return res.status(500).end();
        }
    },
    patch (req, res) {

    },
    delete (req, res) {

    }
}

module.exports.todosController = {
    post (req, res) {

    },
    async get (req, res) {
        const user = req.user;
        console.log(req.params);
        const {noteID} = req.params;

        try {
            const todos = await getTodos(user.id, noteID);
            return res.json(todos);
        }catch (e) {
            return res.status(404).json(`Note with ID ${noteID} was not found`);
        }
    }
}
