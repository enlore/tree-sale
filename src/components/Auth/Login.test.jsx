import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { Login } from "./Login"

const { mockSignInWithGoogle, mockSignInWithMicrosoft } = vi.hoisted(() => ({
    mockSignInWithGoogle: vi.fn(),
    mockSignInWithMicrosoft: vi.fn()
}))

vi.mock("../../services/auth", () => ({
    signInWithGoogle: mockSignInWithGoogle,
    signInWithMicrosoft: mockSignInWithMicrosoft
}))

function renderLogin() {
    return render(
        <MemoryRouter initialEntries={["/login"]}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<p>orders home</p>} />
            </Routes>
        </MemoryRouter>
    )
}

describe("Login", () => {
    beforeEach(() => vi.clearAllMocks())

    it("offers Google and Microsoft sign-in", () => {
        renderLogin()
        expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /microsoft/i })).toBeInTheDocument()
    })

    it("navigates home after a Google sign-in", async () => {
        mockSignInWithGoogle.mockResolvedValue({})
        renderLogin()
        await userEvent.click(screen.getByRole("button", { name: /google/i }))
        expect(screen.getByText("orders home")).toBeInTheDocument()
    })

    it("navigates home after a Microsoft sign-in", async () => {
        mockSignInWithMicrosoft.mockResolvedValue({})
        renderLogin()
        await userEvent.click(screen.getByRole("button", { name: /microsoft/i }))
        expect(screen.getByText("orders home")).toBeInTheDocument()
    })

    it("shows an error when sign-in fails", async () => {
        mockSignInWithGoogle.mockRejectedValue(Object.assign(new Error("boom"), { code: "auth/internal-error" }))
        renderLogin()
        await userEvent.click(screen.getByRole("button", { name: /google/i }))
        expect(screen.getByText(/could not sign in/i)).toBeInTheDocument()
    })

    it("stays quiet when the user closes the popup", async () => {
        mockSignInWithGoogle.mockRejectedValue(Object.assign(new Error("closed"), { code: "auth/popup-closed-by-user" }))
        renderLogin()
        await userEvent.click(screen.getByRole("button", { name: /google/i }))
        expect(screen.queryByText(/could not sign in/i)).not.toBeInTheDocument()
    })
})
