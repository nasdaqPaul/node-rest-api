const request = require('supertest')
const express = require('express')
const config = require('config')
const apiRouter = require('../../../api')
const { connect, disconnect } = require('../../../db')
const User = require('../../../db/models/user')

const app = express()
app.use('/', apiRouter)

describe('/api/users', () => {
    beforeAll(async () => {
        await connect(config.get('dbConfig'))
    })
    afterAll(async () => {
        await User.deleteMany({ firstName: 'test' })
        await disconnect()
    })
    describe('POST', () => {
        test('It validates requests', async () => {
            const response = await request(app).post('/users').send({
                firstName: 'Silla'
            })
            expect(response.statusCode).toBe(400)
        })
        test('It creates a user', async () => {
            const newUser = {
                firstName: 'test',
                lastName: 'test1',
                emailAddress: 'test1@gmail.com',
                password: '1234'
            }
            const response = await request(app).post('/users').send(newUser)
            expect(response.statusCode).toBe(201)

            const createdUser = await User.findOne({ emailAddress: newUser.emailAddress }).lean()
            expect(createdUser.password).not.toEqual(newUser.password)
        })
        test('It does not create a user if user exists', async () => {
            const newUser = {
                firstName: 'test',
                lastName: 'test1',
                emailAddress: 'test1@gmail.com',
                password: '1234'
            }
            const response = await request(app).post('/users').send(newUser)
            expect(response.statusCode).toBe(409)
        })
    })
})
