const {createUser} = require('../../services/users');
const {connect, disconnect} = require('../../db');
const User = require('../../db/models/user');

const testUser = {
    firstName: 'test',
    lastName: 'test',
    emailAddress: 'email@gmail.com',
    password: 'somePassword'
}

describe('UserService', function () {
    beforeAll(async () => {
        // TODO: Find out how to set test configs
        await connect({
            host: "127.0.0.1",
            port: "27017",
            username: "mongoose",
            password: "1234",
            database: "test"
        });
    });
    afterAll(async () => {
        await disconnect();
    });

    /* */
    describe('createUser', function () {
        test('It creates a user document in the database if user does not exist', async function () {
            expect(await createUser(testUser)).toThrow('UserNotExist');
            const createdUser = await User.findOne({emailAddress: testUser.emailAddress});
            expect(createdUser).toBeTruthy();
        })
    })
})