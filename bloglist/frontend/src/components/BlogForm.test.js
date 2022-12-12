import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import BlogForm from "./BlogForm"
import userEvent from "@testing-library/user-event"

describe("<BlogForm />", () => {

    test("Adding a new blog calls the creation callback with correct values", async () => {
        const newBlog = {
            title: "Funny test title",
            author: "Testy McTestface",
            url: "www.foo.bar"
        }

        const handleCreate = jest.fn()

        const { container } = render(<BlogForm createBlog={handleCreate} />)

        const titleInput = container.querySelector("#title-input")
        const authorInput = container.querySelector("#author-input")
        const urlInput = container.querySelector("#url-input")
        const createButton = screen.getByText("Create")

        const user = userEvent.setup()
        await user.type(titleInput, newBlog.title)
        await user.type(authorInput, newBlog.author)
        await user.type(urlInput, newBlog.url)
        await user.click(createButton)

        expect(handleCreate.mock.calls).toHaveLength(1)
        expect(handleCreate.mock.calls[0][0].title).toBe(newBlog.title)
        expect(handleCreate.mock.calls[0][0].author).toBe(newBlog.author)
        expect(handleCreate.mock.calls[0][0].url).toBe(newBlog.url)
    })
})