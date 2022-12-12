const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        user: "630e00d9d0f3e6c1538b0323"
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        user: "630e00d9d0f3e6c1538b0323"
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        user: "630e00d9d0f3e6c1538b0323"
    },
    {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        user: "630e00d9d0f3e6c1538b0323"
    },
    {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        user: "630e00d9d0f3e6c1538b0323"
    },
    {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        user: "630e00d9d0f3e6c1538b0323"
    }
]

const initialUsers = [
    {
        username: "tester",
        name: "Testy tester",
        passwordHash: "$2b$10$mbAvFTbU8ew39g3J7T3u1OswebkyZO.myQTSrE6cBudFzCrJgLPVy",
        _id: "630e00d9d0f3e6c1538b0323"
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ title: "willremovethissoon", author: "Foobar", url: "http://www.nosuchplace.com", likes: 33 })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const getAuthToken = async () => {
    const users = await usersInDb()
    const user = users[0]

    const userForToken = {
        username: user.username,
        id: user.id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    return token
}

module.exports = {
    initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb, getAuthToken
}