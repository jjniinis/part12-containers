describe("Blog app", function () {
    beforeEach(function () {
        cy.request("POST", "http://localhost:3003/api/testing/reset")

        const user = {
            name: "Cypress Tester",
            username: "cypress",
            password: "password"
        }
        cy.request("POST", "http://localhost:3003/api/users/", user)

        cy.visit("http://localhost:3000")
    })

    it("Login form is shown", function () {
        cy.contains("Log in to application")
    })

    describe("Login", function () {
        it("succeeds with correct credentials", function () {
            cy.get("#username").type("cypress")
            cy.get("#password").type("password")
            cy.get("#login-button").click()

            cy.contains("Cypress Tester logged in.")
        })

        it("fails with wrong credentials", function () {
            cy.get("#username").type("cypress")
            cy.get("#password").type("wordpass")
            cy.get("#login-button").click()

            cy.get(".error")
                .should("contain", "Wrong username or password.")
                .and("have.css", "color", "rgb(255, 0, 0)")

            cy.get("html").should("not.contain", "Cypress Tester logged in.")
        })
    })

    describe("When logged in", function () {
        beforeEach(function () {
            cy.login({ username: "cypress", password: "password" })
        })

        it("A blog can be created", function () {
            cy.contains("Create new blog").click()
            cy.get("#title-input").type("Blog Title")
            cy.get("#author-input").type("Cypress Hill")
            cy.get("#url-input").type("http://www.google.com")
            cy.get("#create-button").click()

            cy.contains("Blog Title, Cypress Hill")
        })

        it("A blog can be liked", function () {
            cy.createBlog({ title: "Added blog", author: "Test Author", url: "http://www.google.com" })

            cy.contains("Added blog, Test Author")
            cy.get("#view-button").click()
            cy.contains("likes: 0")

            cy.get("#like-button").click()
            cy.contains("likes: 1")
        })

        it("A blog can be deleted by its creator", function () {
            cy.createBlog({ title: "Added blog", author: "Test Author", url: "http://www.google.com" })

            cy.contains("Added blog, Test Author")
            cy.get("#view-button").click()
            cy.get("#remove-button").click()

            cy.get(".success")
                .should("contain", "Removed blog 'Added blog' by Test Author")
            cy.get("html").should("not.contain", "Added blog, Test Author")
        })

        it("Blogs are sorted by likes", function () {
            cy.createBlog({ title: "Added blog 1", author: "Test Author 1", url: "http://www.google.com" })
            cy.createBlog({ title: "Added blog 2", author: "Test Author 2", url: "http://www.google.com" })
            cy.createBlog({ title: "Added blog 3", author: "Test Author 3", url: "http://www.google.com" })

            // add 3 likes for second blog
            cy.contains("Added blog 2, Test Author 2").find("button").click()
            cy.get("#like-button").click()
            cy.contains("likes: 1")
            cy.get("#like-button").click()
            cy.contains("likes: 2")
            cy.get("#like-button").click()
            cy.contains("likes: 3")
            cy.get("#hide-button").click()

            // add one like for third blog
            cy.contains("Added blog 3, Test Author 3").find("button").click()
            cy.get("#like-button").click()
            cy.contains("likes: 1")
            cy.get("#hide-button").click()

            // check that order is 2, 3, 1
            cy.get(".collapsedBlog").eq(0).should("contain", "Added blog 2, Test Author 2")
            cy.get(".collapsedBlog").eq(1).should("contain", "Added blog 3, Test Author 3")
            cy.get(".collapsedBlog").eq(2).should("contain", "Added blog 1, Test Author 1")

        })
    })
})