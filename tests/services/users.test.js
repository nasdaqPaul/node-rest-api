const { createUser, getUserByEmail, getUserByID, deleteUser, updateUser } = require('../../services/users')
const { connect, disconnect } = require('../../db')
const User = require('../../db/models/user')

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
            host: '127.0.0.1',
            port: '27017',
            username: 'mongoose',
            password: '1234',
            database: 'test'
        })
        await User.create(testUser1)
        await User.create(testUser0)
    })
    afterAll(async () => {
        await User.deleteMany({
            firstName: 'test'
        })
        await disconnect()
    })

    /* */
    describe('createUser', function () {
        test('It creates a user document in the database', async function () {
            const testUser2 = {
                firstName: 'test',
                lastName: 'test2',
                emailAddress: 'email2@gmail.com',
                password: 'somePassword'
            }
            await createUser(testUser2)
            const createdUser = await User.findOne({ lastName: 'test2' }).lean()

            expect(createdUser).toBeTruthy()
            expect(createdUser.password).not.toEqual(testUser2.password)
        })
        test("It throws a 'UserAlreadyExists' error if the email is not unique", async function () {
            await expect(createUser(testUser0)).rejects.toThrow('UserAlreadyExists')
        })
    })
    describe('getUserByEmail', function () {
        test('It returns a user for a valid email address', async function () {
            expect(await getUserByEmail(testUser0.emailAddress)).toBeTruthy()
        })
        test('It returns null for a user that does not exist', async function () {
            expect(await getUserByEmail('notExist@gmail.com')).toBeNull()
        })
    })
    describe('updateUser', function () {
        test('It updates an existing user', async () => {
            const existingUser0 = await User.findOne({ emailAddress: testUser1.emailAddress }).lean()
            const newUser = {
                lastName: 'test3'
            }

            await updateUser(existingUser0._id, newUser)
            expect(await User.exists({ _id: existingUser0._id, lastName: existingUser0.lastName })).toBe(false)
            expect(await User.exists({ _id: existingUser0._id, lastName: newUser.lastName })).toBe(true)
        })
    // test("It throws a 'UserNotFound' when a user doesn't exist")
    })
    describe('deleteUser', () => {
        test('It deletes an existing user', async () => {
            const existingUser0 = await User.findOne({ emailAddress: testUser0.emailAddress }).lean()
            await deleteUser(existingUser0._id)
            expect(await User.exists({ _id: existingUser0._id })).toBe(false)
        })
        test("It throws a 'UserNotFound' for a user ID that does not exist", async () => {
            const existingUser1 = await User.findOne({ emailAddress: testUser1.emailAddress }).lean()
            await deleteUser(existingUser1._id)
            await expect(deleteUser(existingUser1._id)).rejects.toThrow('UserNotFound')
        })
    })
})
