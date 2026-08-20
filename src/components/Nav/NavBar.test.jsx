import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { NavBar } from "./NavBar"
import { setToken, TOKEN_KEY } from "../../services/auth"

const tokenFor = (email) => {
    const exp = Math.floor(Date.now() / 1000) + 3600
    const payload = btoa(JSON.stringify({ email, exp }))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
    return `header.${payload}.signature`
}

const renderNavBar = () =>
    render(
        <MemoryRouter>
            <NavBar />
        </MemoryRouter>
    )

describe("NavBar greeting", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it("greets the logged-in email", () => {
        setToken(tokenFor("dana@treeconservationcorps.org"))
        renderNavBar()

        expect(screen.getByText(/hi dana@treeconservationcorps\.org/i)).toBeInTheDocument()
    })

    it("renders no greeting without a token", () => {
        localStorage.removeItem(TOKEN_KEY)
        renderNavBar()

        expect(screen.queryByText(/^hi /i)).not.toBeInTheDocument()
    })
})
