import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { Authorized } from "./Authorized"
import { setToken } from "../../services/auth"

const futureToken = () => {
    const exp = Math.floor(Date.now() / 1000) + 3600
    const payload = btoa(JSON.stringify({ email: "a@b.org", exp })).replace(/=+$/, "")
    return `header.${payload}.signature`
}

const expiredToken = () => {
    const exp = Math.floor(Date.now() / 1000) - 3600
    const payload = btoa(JSON.stringify({ email: "a@b.org", exp })).replace(/=+$/, "")
    return `header.${payload}.signature`
}

const renderAt = (path) =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Authorized>
                            <p>protected content</p>
                        </Authorized>
                    }
                />
                <Route path="/login" element={<p>login page</p>} />
            </Routes>
        </MemoryRouter>
    )

describe("Authorized", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("redirects to /login when there is no token", () => {
        renderAt("/")
        expect(screen.getByText("login page")).toBeInTheDocument()
        expect(screen.queryByText("protected content")).not.toBeInTheDocument()
    })

    it("redirects to /login when the token is expired", () => {
        setToken(expiredToken())
        renderAt("/")
        expect(screen.getByText("login page")).toBeInTheDocument()
    })

    it("renders its children when authenticated", () => {
        setToken(futureToken())
        renderAt("/")
        expect(screen.getByText("protected content")).toBeInTheDocument()
        expect(screen.queryByText("login page")).not.toBeInTheDocument()
    })
})
