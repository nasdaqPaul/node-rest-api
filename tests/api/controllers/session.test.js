const express = require('express')
const request = require('supertest')
const config = require('config')

const api = require('../../../api')
const { connect, disconnect } = require('../../../db')
const User = require('../../../db/models/user')
const { createUser } = require('../../../services/users')

const app = express()
app.use('/', api)

const testUser0 = {
  firstName: 'test',
  lastName: 'test0',
  emailAddress: 'email0@gmail.com',
  password: 'somePassword'
}

describe('/api/sessions', () => {
  beforeAll(async () => {
    await connect(config.get('dbConfig'))
    await createUser(testUser0)
  })
  afterAll(async () => {
    await User.deleteMany({ firstName: 'test' })
    await disconnect()
  })
  describe('POST', () => {
    test('It validates requests', async () => {
      const response = await request(app).post('/sessions').send({})
      expect(response.statusCode).toBe(400)
    })
    test('It creates and access a refresh token for a user that exists', async () => {
      const response0 = await request(app).post('/sessions').send({
        emailAddress: testUser0.emailAddress,
        password: testUser0.password
      })
      expect(response0.statusCode).toBe(200)
    })
  })
})

// describe('/api/session', ()=> {
//     desribe('DELETE', () => {
//         test('It requires authentication');
//         test('It revokes an access token')
//     })
// })
