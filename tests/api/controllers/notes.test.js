const express = require('express')
const config = require('config')
const supertest = require('supertest')

const apiRouter = require('../../../api')
const User = require('../../../db/models/user')
const Note = require('../../../db/models/note')
const { connect, disconnect } = require('../../../db')
const { createUser } = require('../../../services/users')

const app = express()
app.use('/', apiRouter)

const request = supertest(app)

const testUser0 = {
    firstName: 'test',
    lastName: 'test0',
    emailAddress: 'email0@gmail.com',
    password: 'somePassword'
}

describe('/api/notes', () => {
    let accessToken
    beforeAll(async () => {
        await connect(config.get('dbConfig'))
        await createUser(testUser0)
        const res = await request.post('/sessions').send({
            emailAddress: testUser0.emailAddress,
            password: testUser0.password
        })
        accessToken = res.body.accessToken
    })
    afterAll(async () => {
        await User.deleteMany({ firstName: 'test' })
        await Note.deleteMany({ title: 'TestNote' })
        await disconnect()
    })
    describe('POST', () => {
        test('It requires authentication', async () => {
            const response = await request.post('/notes').send({ title: 'TestTitle', content: 'Some Content' })
            expect(response.statusCode).toBe(401)
        })
        test('It validates requests', async () => {
            const response = await request.post('/notes').set('Authorization', 'Bearer ' + accessToken).send({})
            expect(response.statusCode).toBe(400)
        })
        test('It creates a note for a user', async () => {
            const newNote = {
                title: 'TestTitle',
                content: 'Test Content 1'
            }
            const response = await request.post('/notes').set('Authorization', 'Bearer ' + accessToken).send(newNote)
            expect(response.statusCode).toBe(201)

            const existingUser0 = await User.findOne({ emailAddress: testUser0.emailAddress }).lean()
            const existingNote = await Note.findOne({ author: existingUser0._id, ...newNote }).lean()
            expect(existingNote).toBeTruthy()
            expect(await Note.exists({ author: existingUser0._id, ...newNote })).toBe(true)
        })
    })
    describe('GET', () => {
        test('It requires authentication.', async () => {
            const response = await request.get('/notes')
            expect(response.statusCode).toBe(401)
        })
        test('It returns an array of user notes.', async () => {
            const response = await request.get('/notes').set('Authorization', 'Bearer ' + accessToken)
            expect(response.statusCode).toBe(200)
        })
    })
})

// describe('api/note', () => {
//     describe('GET');
//     describe('PUT');
//     describe('PATCH');
//     describe('DELETE')
// })
