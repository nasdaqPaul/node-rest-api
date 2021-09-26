const express = require('express')
const config = require('config')
const supertest = require('supertest')

const apiRouter = require('../../../api')
const User = require('../../../db/models/user')
const Note = require('../../../db/models/note')
const {connect, disconnect} = require('../../../db')
const {createUser} = require('../../../services/users')

const app = express()
app.use('/', apiRouter)

const request = supertest(app)

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
        {title: 'Todo0', done: false},
        {title: 'Todo1', done: true},
        {title: 'Todo2', done: false},
        {title: 'Todo3', done: true},
        {title: 'Todo4', done: false},
        {title: 'Todo5', done: true},
        {title: 'Todo6', done: false},
        {title: 'Todo7', done: true},
        {title: 'Todo8', done: false},
        {title: 'Todo9', done: true}
    ]
}

describe('/api/note/noteID/todos', () => {
    let accessToken;
    beforeAll(async () => {
        await connect(config.get('dbConfig'));
        await createUser(testUser0);

        const existingUser0 = await User.findOne({emailAddress: testUser0.emailAddress}).lean();
        await Note.create({author: existingUser0._id, ...testNote0});

        const res = await request.post('/sessions').send({
            emailAddress: testUser0.emailAddress,
            password: testUser0.password
        })
        accessToken = res.body.accessToken
    })
    afterAll(async () => {
        await User.deleteMany({firstName: 'test'})
        await Note.deleteMany({title: 'TestNote'})
        await disconnect()
    })
    describe('GET', () => {
        test('It requires authentication.', async () => {
            const existingNote0 = await Note.findOne({title: testNote0.title, content: testNote0.content}).lean();
            const response = await request.get(`/notes/${existingNote0._id}/todos/`);
            expect(response.statusCode).toBe(401);
        });
        test('It returns a list of todos', async () => {
            const existingNote0 = await Note.findOne({title: testNote0.title, content: testNote0.content}).lean();
            console.log(existingNote0);
            const response = await request.get(`/note/${existingNote0._id}/todos/`).set('Authorization', 'Bearer ' + accessToken);
            console.log(response.body);
            // expect(response.statusCode).toBe(200)
        })
    })
    describe('POST', () => {
        test('It requires authentication.', async () => {
            const existingNote0 = await Note.findOne({title: testNote0.title, content: testNote0.content}).lean();
            const response = await request.post(`/notes/${existingNote0._id}/todos/`).send({
                title: 'Test10',
                done: false
            });
            expect(response.statusCode).toBe(401);
        })
        test('It validates requests.', async () => {
            const response = await request.post('/notes').set('Authorization', 'Bearer ' + accessToken).send({})
            expect(response.statusCode).toBe(400)
        })
    })
})