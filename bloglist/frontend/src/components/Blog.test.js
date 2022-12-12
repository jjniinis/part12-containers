import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import Blog from "./Blog"
import userEvent from "@testing-library/user-event"

describe("<Blog />", () => {

    let container, blog, loggedUser, handleAddLike, handleRemoveBlog

    beforeEach(() => {
        blog = {
            id: "abc123",
            title: "Funny test title",
            author: "Testy McTestface",
            url: "www.foo.bar",
            likes: 17,
            user: "def456"
        }

        loggedUser = {
            name: "Creaty McCreateface"
        }

        handleAddLike = jest.fn()
        handleRemoveBlog = jest.fn()

        container = render(<Blog key={blog.id} blog={blog} handleAddLike={handleAddLike} handleRemoveBlog={handleRemoveBlog} currentUser={loggedUser} />).container
    })

    test("renders only title and author", () => {
        const div = container.querySelector(".collapsedBlog")

        expect(div).toHaveTextContent(`${blog.title}, ${blog.author}`)
    })

    test("renders more data after button has been pressed", async () => {
        const user = userEvent.setup()
        const button = screen.getByText("View")
        await user.click(button)

        const titleElement = screen.getByText(`${blog.title}`, { exact: false })
        const urlElement = screen.getByText(`${blog.url}`, { exact: false })
        const likesElement = screen.getByText(`${blog.likes}`, { exact: false })
        const authorElement = screen.getByText(`${blog.author}`, { exact: false })

        expect(titleElement).toBeDefined()
        expect(urlElement).toBeDefined()
        expect(likesElement).toBeDefined()
        expect(authorElement).toBeDefined()
    })

    test("pressing the 'like' button twice calls the event handler twice", async () => {
        const user = userEvent.setup()
        const button = screen.getByText("View")
        await user.click(button)

        const likeButton = screen.getByText("Like")
        await user.click(likeButton)
        await user.click(likeButton)

        expect(handleAddLike.mock.calls).toHaveLength(2)
    })
})