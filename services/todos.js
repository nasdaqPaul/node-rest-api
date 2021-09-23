const Note = require('../db/models/note')

module.exports = {
  async getTodos (noteID, todoIndex) {
    return Note.findById(noteID, { _id: 0, todos: 1 }).lean()
  },
  async getTodo (noteID, todoIndex) {

  },
  async deleteTodo (noteID, todoIndex) {

  },
  async updateTodo (noteID, todoIndex) {

  },
  async replaceTodo (noteID, todoIndex) {

  }
}
