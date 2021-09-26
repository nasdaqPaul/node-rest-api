const config = require('config')
const { connect, disconnect } = require('../../db')
const User = require('../../db/models/user')
const Note = require('../../db/models/note')
const { getTodos, getTodo, updateTodo, replaceTodo} = require('../../services/todos')

const testUser0 = {
    firstName: 'test',
    lastName: 'test0',
    emailAddress: 'email0@gmail.com',
    password: 'somePassword'
}
const testUser1 = {
    firstName: 'test',
    lastName: 'test1',
    emailAddress: 'email1@gmail.com',
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

const testNote1 = {
    title: 'TestNote',
    content: 'Test Content 1',
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
        const user0 = new User(testUser0);
        const user1 = new User(testUser1);
        await user0.save();
        await user1.save();

        const note0 = new Note({ author: user0._id, ...testNote0 });
        const note1 = new Note({ author: user1._id, ...testNote1 });
        await note0.save();
        await note1.save();
    })
    afterAll(async () => {
    // CLEANUP
        await User.deleteMany({ firstName: 'test' })
        await Note.deleteMany({ title: 'TestNote' })
        await disconnect()
    })
    describe('getTodos', function () {
        test('It returns an array of todos', async () => {
            const existingUser0 = await User.findOne({emailAddress: testUser0.emailAddress}).lean();
            const existingNote0 = await Note.findOne({ title: testNote0.title, content: testNote0.content }).lean();
            const todos = await getTodos(existingUser0._id, existingNote0._id)
            expect(todos).toEqual(testNote0.todos)
        })
    })
    describe('getTodo', () => {
        test('It returns a todo given an index', async () => {
            const existingNote0 = await Note.findOne({ title: testNote0.title, content: testNote0.content }).lean();
            expect(await getTodo(existingNote0._id, -2)).toBeNull();
        });
        test("It throws a 'NoteNotFound' for an invalid note ID", async () => {
            await expect(getTodo('randomID', 2)).rejects.toThrow('NoteNotFound');
        })
    });
    describe('updateTodo', () => {
        test('It updated a todo', async () => {
            const existingUser0 = await User.findOne({emailAddress: testUser0.emailAddress}).lean();
            const existingNote0 = await Note.findOne({title: testNote0.title, content: testNote0.content}).lean();
            const newTodo = {
                title: 'NewTitle'
            }
            await updateTodo(existingUser0._id, existingNote0._id, 0, newTodo);
            const modifiedNote = await Note.findById(existingNote0._id).lean();
            expect(modifiedNote.todos[0].title).toBe(newTodo.title);
        });
        test("It throws a 'NoteNotFound' for a note that does not exist", async () => {
            const existingUser0 = await User.findOne({emailAddress: testUser0.emailAddress}).lean();
            const existingNote1 = await Note.findOne({title: testNote1.title, content: testNote1.content}).lean();
            await expect(updateTodo(existingUser0._id, existingNote1._id, 0, {done: true})).rejects.toThrow('NoteNotFound');
        });
        test("It throws a 'TodoNotFound' for an invalid index", async () => {
            const existingUser0 = await User.findOne({emailAddress: testUser0.emailAddress}).lean();
            const existingNote0 = await Note.findOne({title: testNote0.title, content: testNote0.content}).lean();
            await expect(updateTodo(existingUser0._id, existingNote0._id, 11, {done: true})).rejects.toThrow('TodoNotFound');
        });
    })
    describe('replaceTodo', () => {
        test('It replaces a todo', async () => {
            const existingUser0 = await User.findOne({emailAddress: testUser0.emailAddress}).lean();
            const existingNote0 = await Note.findOne({title: testNote0.title, content: testNote0.content}).lean();
            const newTodo = {
            }
            await replaceTodo(existingUser0._id, existingNote0._id, 0, newTodo);
            const modifiedNote = await Note.findById(existingNote0._id).lean();
            console.log(modifiedNote.todos);
            expect(modifiedNote.todos[0].title).toBeUndefined();
        });
        test("It throws a 'NoteNotFound' for a note that does not exist", async () => {
            const existingUser0 = await User.findOne({emailAddress: testUser0.emailAddress}).lean();
            const existingNote1 = await Note.findOne({title: testNote1.title, content: testNote1.content}).lean();
            await expect(replaceTodo(existingUser0._id, existingNote1._id, 0, {done: true})).rejects.toThrow('NoteNotFound');
            await expect(replaceTodo("RandomUserID", existingNote1._id, 0, {done: true})).rejects.toThrow('NoteNotFound');
        });
        test("It throws a 'TodoNotFound' for an invalid index", async () => {
            const existingUser0 = await User.findOne({emailAddress: testUser0.emailAddress}).lean();
            const existingNote0 = await Note.findOne({title: testNote0.title, content: testNote0.content}).lean();
            await expect(replaceTodo(existingUser0._id, existingNote0._id, 11, {done: true})).rejects.toThrow('TodoNotFound');
        });
    })
})
