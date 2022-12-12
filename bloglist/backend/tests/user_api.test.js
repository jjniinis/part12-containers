const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")

const api = supertest(app)

const User = require("../models/user")

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

describe("user api", () => {

    test("a valid user can be added", async () => {
        const newUser = {
            username: "newuser",
            name: "New User",
            password: "p4assw0rd"
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)

        const usernames = usersAtEnd.map(n => n.username)
        expect(usernames).toContain(
            newUser.username
        )
    })

    test("when adding a user, username must be defined", async () => {
        const newUser = {
            name: "New User",
            password: "p4assw0rd"
        }

        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)

        expect(response.body.error).toContain("User validation failed: username: Path `username` is required.")
    })

    test("when adding a user, password must be defined", async () => {
        const newUser = {
            username: "newuser",
            name: "New User"
        }

        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)

        expect(response.body.error).toContain("password needs to be defined")
    })

    test("when adding a user, username must be at least 3 characters long", async () => {
        const newUser = {
            username: "nu",
            name: "New User",
            password: "p4assw0rd"
        }

        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)

        expect(response.body.error).toContain("is shorter than the minimum allowed length")
    })

    test("when adding a user, password must be at least 3 characters long", async () => {
        const newUser = {
            username: "newuser",
            name: "New User",
            password: "pw"
        }

        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)

        expect(response.body.error).toContain("password needs to be at least 3 characters")
    })
})

afterAll(() => {
    mongoose.connection.close()
})