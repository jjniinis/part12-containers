const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    let favorite = {}
    let highestLikes = 0
    blogs.forEach(element => {
        if (element.likes >= highestLikes) {
            favorite = {
                title: element.title,
                author: element.author,
                likes: element.likes
            }
            highestLikes = element.likes
        }
    })

    return favorite
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    let authors = {}

    blogs.forEach(element => {
        const author = element.author
        if (authors[author] === undefined) {
            authors[author] = 1
        }
        else {
            authors[author] = authors[author] + 1
        }
    })

    let highestAuthor = ""
    let highestAmount = 0

    for (const [key, value] of Object.entries(authors)) {
        if (value >= highestAmount) {
            highestAuthor = key
            highestAmount = value
        }
    }

    return { author: highestAuthor, blogs: highestAmount }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    let authors = {}

    blogs.forEach(element => {
        const author = element.author
        if (authors[author] === undefined) {
            authors[author] = element.likes
        }
        else {
            authors[author] = authors[author] + element.likes
        }
    })

    let highestAuthor = ""
    let highestAmount = 0

    for (const [key, value] of Object.entries(authors)) {
        if (value >= highestAmount) {
            highestAuthor = key
            highestAmount = value
        }
    }

    return { author: highestAuthor, likes: highestAmount }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}