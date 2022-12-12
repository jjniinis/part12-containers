import React from "react"
import { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import Blog from "./components/Blog"
import Togglable from "./components/Togglable"
import BlogForm from "./components/BlogForm"
import blogService from "./services/blogs"
import loginService from "./services/login"

const localSaveName = "loggedBloglistAppUser"

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [user, setUser] = useState(null)
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [notificationMessageType, setNotificationMessageType] = useState(null)
    const addBlogFromRef = useRef()

    useEffect(() => {
        const getBlogs = async () => {
            const result = await blogService.getAll()
            setBlogs(result)
        }
        getBlogs()
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem(localSaveName)
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const setNotification = (message, messageType) => {
        setNotificationMessage(message)
        setNotificationMessageType(messageType)
        setTimeout(() => {
            setNotificationMessage(null)
            setNotificationMessageType(null)
        }, 5000)
    }

    const handleAddBlog = async (blogObject) => {
        addBlogFromRef.current.toggleVisibility()
        try {
            const result = await blogService.create(blogObject)

            setNotification(`Added new blog '${result.title}' by ${result.author}`, "success")
            setBlogs(blogs.concat(result))
        } catch (error) {
            setNotification(`Failed to add blog due to error: ${error}`, "error")
        }
    }

    const handleAddLike = async (updatedBlog) => {
        try {
            const result = await blogService.update(updatedBlog.id, updatedBlog)

            //setNotification(`Added like for blog '${result.title}' by ${result.author}`, "success")
            setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : result))
        } catch (error) {
            setNotification(`Failed to add like to blog due to error: ${error}`, "error")
        }
    }

    const handleRemoveBlog = async (blogObject) => {
        try {
            await blogService.remove(blogObject.id)

            setNotification(`Removed blog '${blogObject.title}' by ${blogObject.author}`, "success")
            setBlogs(blogs.filter(function (value) { return value.id !== blogObject.id }))
        } catch (error) {
            setNotification(`Failed to remove blog due to error: ${error}`, "error")
        }
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username, password,
            })
            window.localStorage.setItem(localSaveName, JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            setUsername("")
            setPassword("")
            setNotification(`Logged in as ${user.name}`, "success")
        } catch (exception) {
            setNotification("Wrong username or password.", "error")
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        window.localStorage.removeItem(localSaveName)
        setUser(null)
        setNotification("Logged out", "success")
    }

    const loginForm = () => (
        <div>
            <h2>Log in to application</h2>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        id="username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        id="password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button id="login-button" type="submit">Login</button>
            </form>
        </div>
    )

    const blogList = () => (
        <div>
            <h2>blogs</h2>
            <div>
                <p>{user.name} logged in.<button onClick={handleLogout}>Logout</button></p>
            </div>
            <Togglable buttonLabel="Create new blog" ref={addBlogFromRef}>
                <BlogForm createBlog={handleAddBlog} />
            </Togglable>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
                <Blog key={blog.id} blog={blog} handleAddLike={handleAddLike} handleRemoveBlog={handleRemoveBlog} currentUser={user} />
            )}
        </div>
    )

    return (
        <div>
            <Notification message={notificationMessage} messageType={notificationMessageType} />
            {user === null ? loginForm() : blogList() }
        </div>

    )
}

const Notification = ({ message, messageType }) => {
    if (message === null) {
        return null
    }

    return (
        <div className={messageType}>
            {message}
        </div>
    )
}

Notification.propTypes = {
    message: PropTypes.string,
    messageType: PropTypes.string
}

export default App
