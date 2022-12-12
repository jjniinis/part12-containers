const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")

const api = supertest(app)

const Blog = require("../models/blog")
const User = require("../models/user")

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

describe("blog api", () => {

    test("all blogs are returned", async () => {
        const response = await api.get("/api/blogs")

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test("returned blogs have 'id' field as their identifier", async () => {
        const response = await api.get("/api/blogs")
        expect(response.body[0].id).toBeDefined()
    })

    test("a valid blog can be added", async () => {
        const newBlog = {
            title: "New added blog",
            author: "Mr. Blogster",
            url: "https://www.bloggy.com/",
            likes: 8
        }

        const token = await helper.getAuthToken()

        await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(n => n.title)
        expect(titles).toContain(
            newBlog.title
        )
    })

    test("adding a blog fails if not authorization token is provided", async () => {
        const newBlog = {
            title: "New added blog",
            author: "Mr. Blogster",
            url: "https://www.bloggy.com/",
            likes: 8
        }

        await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(401)
            .expect("Content-Type", /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test("likes is set to 0 if not given when adding a blog", async () => {
        const newBlog = {
            title: "New added blog",
            author: "Mr. Blogster",
            url: "https://www.bloggy.com/"
        }

        const token = await helper.getAuthToken()

        const resultBlog = await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/)

        expect(resultBlog.body.likes).toBeDefined()
    })

    test("when adding a blog, title must be defined", async () => {
        const newBlog = {
            author: "Mr. Blogster",
            url: "https://www.bloggy.com/",
            likes: 8
        }

        const token = await helper.getAuthToken()

        await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })

    test("when adding a blog, url must be defined", async () => {
        const newBlog = {
            title: "New added blog",
            author: "Mr. Blogster",
            likes: 8
        }

        const token = await helper.getAuthToken()

        await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })

    test("deletion of a blog", async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        const token = await helper.getAuthToken()

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const titles = blogsAtEnd.map(n => n.title)
        expect(titles).not.toContain(
            blogToDelete.title
        )
    })

    test("changing the likes of a blog", async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToChange = blogsAtStart[0]
        blogToChange.likes = 50
        delete blogToChange.author

        const changedBlog = await api
            .put(`/api/blogs/${blogToChange.id}`).
            send(blogToChange)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length
        )

        expect(changedBlog.body.likes).toBe(50)
    })
})

afterAll(() => {
    mongoose.connection.close()
})