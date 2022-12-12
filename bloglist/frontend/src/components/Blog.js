import React from "react"
import { useState } from "react"
import PropTypes from "prop-types"


const Blog = ({ blog, handleAddLike, handleRemoveBlog, currentUser }) => {
    const [expanded, setExpanded] = useState(false)

    const createdByCurrentUser = blog.user.username === currentUser.username
    const showWhenOwnBlog = { display: createdByCurrentUser ? "" : "none" }

    const addLike = (blog) => {
        handleAddLike({
            id: blog.id,
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes + 1,
            user: blog.user.id
        })
    }

    const removeBlog = (blog) => {
        if (window.confirm(`Do you want to remove ${blog.title} by ${blog.author}`)) {
            handleRemoveBlog({
                id: blog.id,
                title: blog.title,
                author: blog.author
            })
        }
    }

    if (expanded) {
        return (
            <div className="expandedBlog">
                <div>{blog.title} <button id="hide-button" onClick={() => setExpanded(!expanded)}>Hide</button></div>
                <div>{blog.url}</div>
                <div>likes: {blog.likes} <button id="like-button" onClick={() => addLike(blog)}>Like</button></div>
                <div>{blog.author}</div>
                <div style={showWhenOwnBlog}><button button id="remove-button" onClick={() => removeBlog(blog)}>Remove</button></div>
            </div>
        )
    } else {
        return (
            <div className="collapsedBlog">
                {blog.title}, {blog.author} <button id="view-button" onClick={() => setExpanded(!expanded) }>View</button>
            </div>
        )
    }
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    handleAddLike: PropTypes.func.isRequired,
    handleRemoveBlog: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired
}

export default Blog