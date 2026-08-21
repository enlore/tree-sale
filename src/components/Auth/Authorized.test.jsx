import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, act } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { Authorized } from "./Authorized"

const { mockSubscribe } = vi.hoisted(() => ({ mockSubscribe: vi.fn() }))

vi.mock("../../services/auth", () => ({ subscribe: mockSubscribe }))

function renderGuarded() {
    return render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/login" element={<p>login page</p>} />
                <Route path="/" element={<Authorized><p>secret orders</p></Authorized>} />
            </Routes>
        </MemoryRouter>
    )
}

describe("Authorized", () => {
    let emitAuthState

    beforeEach(() => {
        emitAuthState = undefined
        mockSubscribe.mockImplementation((callback) => {
            emitAuthState = callback
            return () => {}
        })
    })

    it("shows the loading state until auth resolves", () => {
        renderGuarded()
        expect(screen.getByText(/loading/i)).toBeInTheDocument()
        expect(screen.queryByText("secret orders")).not.toBeInTheDocument()
    })

    it("redirects to /login when auth resolves signed-out", async () => {
        renderGuarded()
        await act(async () => emitAuthState(null))
        expect(screen.getByText("login page")).toBeInTheDocument()
    })

    it("renders children when auth resolves signed-in", async () => {
        renderGuarded()
        await act(async () => emitAuthState({ uid: "uid-1" }))
        expect(screen.getByText("secret orders")).toBeInTheDocument()
    })
})
