const User = require('../../db/models/user')
const Note = require('../../db/models/note')
// const config = require('config');
const { createUserNote, getUserNote, deleteUserNote, replaceUserNote } = require('../../services/notes')
const { disconnect, connect } = require('../../db')

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
  content: 'Test Content 0'
}
const testNote1 = {
  title: 'TestNote',
  content: 'Test Content 1'
}
describe('notesService', () => {
  beforeAll(async () => {
    await connect({
      host: '127.0.0.1',
      port: '27017',
      username: 'mongoose',
      password: '1234',
      database: 'test'
    })
    const user0 = new User(testUser0)
    const user1 = new User(testUser1)

    await user0.save()
    await user1.save()

    await Note.create({
      author: user0._id,
      ...testNote0
    })
    await Note.create({
      author: user1._id,
      ...testNote1
    })
  })
  afterAll(async () => {
    await User.deleteMany({ firstName: 'test' })
    await Note.deleteMany({ title: 'TestNote' })
    await disconnect()
  })
  describe('createUserNote', () => {
    test('It creates a note for a user', async () => {
      const existingUser = await User.findOne({ emailAddress: testUser0.emailAddress })
      const newNote = {
        title: 'TestNote',
        content: 'Test Content 0'
      }
      await createUserNote(existingUser.id, newNote)
      expect(Note.findOne({
        _id: existingUser.id,
        ...newNote
      }).lean()).toBeTruthy()
    })
    test("It throws 'UserDoeNotExist' for a user that does not exist", async () => {
      const newNote = {
        title: 'TestNote',
        content: 'Test Content 1'
      }
      await expect(createUserNote('someRandomID', newNote)).rejects.toThrow('UserDoesNotExist')
    })
  })
  describe('getUserNote', () => {
    test('It returns a note for a valid user', async () => {
      const existingUser = await User.findOne({ emailAddress: testUser0.emailAddress }).lean()
      const existingNote = await Note.findOne({ ...testNote0 })
      expect(await getUserNote(existingUser._id, existingNote._id)).toBeTruthy()
    })
    test('It returns null for a note that does not exist', async () => {
      const existingUser0 = await User.findOne({ emailAddress: testUser0.emailAddress }).lean()
      const existingUser1 = await User.findOne({ emailAddress: testUser1.emailAddress }).lean()
      const existingNote0 = await Note.findOne({ ...testNote0 }).lean()
      const existingNote1 = await Note.findOne({ ...testNote1 }).lean()

      expect(await getUserNote(existingUser1._id, 'invalidNoteId')).toBeNull()
      expect(await getUserNote('invalidUserId', existingNote1._id)).toBeNull()
      expect(await getUserNote(existingUser0._id, existingNote1._id)).toBeNull()
      expect(await getUserNote(existingUser1._id, existingNote0._id)).toBeNull()
    })
  })
  describe('replaceUserNote', () => {
    test('It replaces a note', async () => {
      const existingUser0 = await User.findOne({ emailAddress: testUser0.emailAddress })
      const userNote = new Note({
        author: existingUser0._id,
        title: 'TestNote',
        content: 'Test Content 4'
      })
      await userNote.save()
      const newNote = {
        title: 'TestNote',
        content: 'NewNote',
        author: 'randomId'
      }
      await replaceUserNote(existingUser0._id, userNote._id, newNote)
      expect(await Note.exists({
        _id: userNote._id,
        author: existingUser0._id,
        title: 'TestNote',
        content: 'Test Content 4'
      })).toBe(false)
      expect(await Note.exists({
        _id: userNote._id,
        author: existingUser0._id,
        title: 'TestNote',
        content: 'NewNote'
      })).toBe(true)
    })
    test("It throws a 'NoteNoteFound' for a note that does not exist", async () => {
      const existingUser0 = await User.findOne({ emailAddress: testUser0.emailAddress }).lean()
      const existingNote1 = await Note.findOne(testNote1).lean()

      await expect(replaceUserNote(existingUser0._id, existingNote1._id, {
        title: 'TestNote',
        content: 'Test Content 4'
      })).rejects.toThrow('NoteNotFound')
      await expect(replaceUserNote(existingUser0._id, 'someRandomID', {
        title: 'TestNote',
        content: 'Test Content 4'
      })).rejects.toThrow('NoteNotFound')
      await expect(replaceUserNote('someRandomID', existingNote1._id, {
        title: 'TestNote',
        content: 'Test Content 4'
      })).rejects.toThrow('NoteNotFound')
      await expect(replaceUserNote('someRandomID', 'anotherRandomID', {
        title: 'TestNote',
        content: 'Test Content 4'
      })).rejects.toThrow('Cast to ObjectId failed')
    })
  })
  describe('deleteUserNote', () => {
    test('It deletes a user note', async () => {
      const existingUser0 = await User.findOne({ emailAddress: testUser0.emailAddress }).lean()
      const newNote = new Note({
        author: existingUser0._id,
        title: 'TestNote',
        content: 'Test Content 1'
      })
      await newNote.save()
      await deleteUserNote(existingUser0._id, newNote._id)

      expect(await Note.exists({ _id: newNote._id })).toBe(false)
    })
    test("It throws a 'NoteNotFound' when note to delete is not found", async () => {
      const existingUser0 = await User.findOne({ emailAddress: testUser0.emailAddress }).lean()
      const existingNote0 = await Note.findOne(testNote0).lean()
      const existingNote1 = await Note.findOne(testNote1).lean()

      await expect(deleteUserNote(existingUser0._id, existingNote1._id)).rejects.toThrow('NoteNotFound')
      await expect(deleteUserNote(existingUser0._id, 'someRandomId')).rejects.toThrow('NoteNotFound')
      await expect(deleteUserNote('randomID', existingNote1._id)).rejects.toThrow('Cast to ObjectId failed')
      await expect(deleteUserNote('randomID', 'anotherRandomId')).rejects.toThrow('Cast to ObjectId failed')
    })
  })
})
