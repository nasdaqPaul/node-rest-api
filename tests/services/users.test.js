const {createUser, getUserByEmail, getUserByID} = require('../../services/users');
const {connect, disconnect} = require('../../db');
const User = require('../../db/models/user');

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

describe('UserService', function () {
    beforeAll(async () => {
        await connect({
            host: "127.0.0.1",
            port: "27017",
            username: "mongoose",
            password: "1234",
            database: "test"
        });
        await User.create(testUser1);
        await User.create(testUser0);
    });
    afterAll(async () => {
        await User.deleteMany({
            firstName: 'test'
        })
        await disconnect();
    });

    /* */
    describe('createUser', function () {
        test('It creates a user document in the database', async function () {
            const testUser2 = {
                firstName: 'test',
                lastName: 'test2',
                emailAddress: 'email2@gmail.com',
                password: 'somePassword'
            }
            await createUser(testUser2);
            const createdUser = await User.findOne({lastName: 'test2'}).lean();

            expect(createdUser).toBeTruthy();
            expect(createdUser.password).not.toEqual(testUser2.password);
        });
        test("It throws a 'UserAlreadyExists' error if the email is not unique", async function () {
           await expect(createUser(testUser0)).rejects.toThrow("UserAlreadyExists");
        })
    });

    describe('getUserByEmail', function () {
        test('It returns a user for a valid email address', async function () {
            expect(await getUserByEmail(testUser0.emailAddress)).toBeTruthy();
        });
        test('It returns null for a user that does not exist', async function () {
            expect(await getUserByEmail('notExist@gmail.com')).toBeNull()
        })
    })
})