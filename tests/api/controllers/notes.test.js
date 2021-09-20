const request = require('supertest');
const express = require('express');
const config = require('config');
const apiRouter = require('../../../api')
const {connect, disconnect} = require('../../../db');
const User = require('../../../db/models/user');

const app = express();
app.use('/', apiRouter);

const testUser0 = {
    firstName: 'test',
    lastName: 'test0',
    emailAddress: 'email0@gmail.com',
    password: 'somePassword'
}

describe('/api/notes', () => {
    beforeAll(async () => {
        await connect(config.get('dbConfig'));
        await User.create(testUser0);
    });
    afterAll(async () => {
        await User.deleteMany({firstName: 'test'});
        await disconnect();
    })
    describe('POST', () => {
        test('It requires authentication');
        test('It validates requests');
        test('It creates a note for a user');
    });
    describe('GET', () => {
        test('It requires authentication');
        test('It validates requests');
        test('It returns an array of user notes');
    });
})

describe('api/note', () => {
    describe('GET');
    describe('PUT');
    describe('PATCH');
    describe('DELETE')
})