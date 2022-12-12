import React from "react"
import { useState } from "react"
import PropTypes from "prop-types"

const BlogForm = ({ createBlog }) => {
    const [newTitle, setNewTitle] = useState("")
    const [newAuthor, setNewAuthor] = useState("")
    const [newUrl, setNewUrl] = useState("")

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value)
    }

    const handleAuthorChange = (event) => {
        setNewAuthor(event.target.value)
    }

    const handleUrlChange = (event) => {
        setNewUrl(event.target.value)
    }

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl
        })

        setNewTitle("")
        setNewAuthor("")
        setNewUrl("")
    }

    return (
        <div>
            <h2>Create new</h2>
            <form onSubmit={addBlog}>
                <div>Title:<input
                    value={newTitle}
                    onChange={handleTitleChange}
                    id="title-input" />
                </div>
                <div>Author:<input
                    value={newAuthor}
                    onChange={handleAuthorChange}
                    id="author-input" />
                </div>
                <div>Url:<input
                    value={newUrl}
                    onChange={handleUrlChange}
                    id="url-input" />
                </div>
                <button id="create-button" type="submit">Create</button>
            </form>
        </div>
    )
}

BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}

export default BlogForm