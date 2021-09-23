const config = require('config')
const { connect, disconnect } = require('../../db')
const User = require('../../db/models/user')
const Note = require('../../db/models/note')
const { getTodos } = require('../../services/todos')

const testUser0 = {
  firstName: 'test',
  lastName: 'test0',
  emailAddress: 'email0@gmail.com',
  password: 'somePassword'
}

const testNote0 = {
  title: 'TestNote',
  content: 'Test Content 0',
  todos: [
    { title: 'Todo0', done: false },
    { title: 'Todo1', done: true },
    { title: 'Todo2', done: false },
    { title: 'Todo3', done: true },
    { title: 'Todo4', done: false },
    { title: 'Todo5', done: true },
    { title: 'Todo6', done: false },
    { title: 'Todo7', done: true },
    { title: 'Todo8', done: false },
    { title: 'Todo9', done: true }
  ]
}

describe('todoService', () => {
  beforeAll(async () => {
    // SETUP
    await connect(config.get('dbConfig'))
    const user0 = new User(testUser0)
    await user0.save()

    const note0 = new Note({ author: user0._id, ...testNote0 })
    await note0.save()
  })
  afterAll(async () => {
    // CLEANUP
    await User.deleteMany({ firstName: 'test' })
    await Note.deleteMany({ title: 'TestNote' })
    await disconnect()
  })
  describe('getTodos', function () {
    test('It returns an array of todos', async () => {
      const existingNote0 = await Note.findOne({ title: testNote0.title, content: testNote0.content }).lean()
      const todos = await getTodos(existingNote0._id)

      console.log(todos)
    })
  })
})
