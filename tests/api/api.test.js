const request = require('supertest');
const express = require('express');
const api = require('../../api');
const {connect, disconnect} = require("../../db");
const User = require("../../db/models/user");

app = express();
app.use('/', api)

const testUser0 = {
    firstName: 'test',
    lastName: 'test0',
    emailAddress: 'email0@gmail.com',
    password: 'somePassword'
}

describe('POST /users', () => {
    beforeAll(async () => {
        await connect({
            host: "127.0.0.1",
            port: "27017",
            username: "mongoose",
            password: "1234",
            database: "test"
        });
        await User.create(testUser0);
    });
    afterAll(async () => {
        await User.deleteMany({
            firstName: 'test'
        })
        await disconnect();
    });
    test('it creates a user given a username and a password', async () => {
        const response = await request(app).post('/users').send({
            'firstName': 'test',
            'lastName': 'test',
            'emailAddress': 'silla@gmail.com',
            'password': '1234'
        });
        expect(response.statusCode).toBe(201);
    })
    test('It does not create a user if user exists', async () => {
        const response = await request(app).post('/users').send({
            'firstName': 'test',
            'lastName': 'test',
            'emailAddress': 'silla@gmail.com',
            'password': '1234'
        });
        console.log(response)
    })
})