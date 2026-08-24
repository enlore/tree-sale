import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { PendingAccess } from "./PendingAccess"

const { mockAuth, mockSendVerificationEmail, mockGetIdToken, mockLogOut } = vi.hoisted(() => ({
    mockAuth: { currentUser: null },
    mockSendVerificationEmail: vi.fn(),
    mockGetIdToken: vi.fn(),
    mockLogOut: vi.fn()
}))

vi.mock("../../services/firebase", () => ({ auth: mockAuth }))
vi.mock("../../services/auth", () => ({
    sendVerificationEmail: mockSendVerificationEmail,
    getIdToken: mockGetIdToken,
    logOut: mockLogOut
}))

function renderPage() {
    return render(
        <MemoryRouter initialEntries={["/pending-access"]}>
            <Routes>
                <Route path="/pending-access" element={<PendingAccess />} />
                <Route path="/" element={<p>orders home</p>} />
                <Route path="/login" element={<p>login page</p>} />
            </Routes>
        </MemoryRouter>
    )
}

describe("PendingAccess", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockSendVerificationEmail.mockResolvedValue()
        mockGetIdToken.mockResolvedValue("fresh-token")
        mockLogOut.mockResolvedValue()
    })

    it("auto-signs-out a verified user", async () => {
        mockAuth.currentUser = { email: "x@example.com", emailVerified: true, reload: vi.fn() }
        renderPage()
        await waitFor(() => expect(mockLogOut).toHaveBeenCalled())
        await waitFor(() => expect(screen.getByText("login page")).toBeInTheDocument())
        expect(screen.queryByRole("button", { name: /send verification/i })).not.toBeInTheDocument()
    })

    it("offers email verification to an unverified user", async () => {
        mockAuth.currentUser = { email: "x@example.com", emailVerified: false, reload: vi.fn() }
        renderPage()
        await userEvent.click(screen.getByRole("button", { name: /send verification/i }))
        expect(mockSendVerificationEmail).toHaveBeenCalled()
        expect(screen.getByText(/check your email/i)).toBeInTheDocument()
    })

    it("refreshes the token and goes home once verification is confirmed", async () => {
        const user = { email: "x@example.com", emailVerified: false, reload: vi.fn() }
        mockAuth.currentUser = user
        renderPage()
        user.reload.mockImplementation(async () => { mockAuth.currentUser = { ...user, emailVerified: true } })
        await userEvent.click(screen.getByRole("button", { name: /i clicked the link/i }))
        expect(mockGetIdToken).toHaveBeenCalledWith(true)
        expect(screen.getByText("orders home")).toBeInTheDocument()
    })

    it("says the link has not been clicked yet when reload shows unverified", async () => {
        const user = { email: "x@example.com", emailVerified: false, reload: vi.fn().mockResolvedValue() }
        mockAuth.currentUser = user
        renderPage()
        await userEvent.click(screen.getByRole("button", { name: /i clicked the link/i }))
        expect(screen.getByText(/not verified yet/i)).toBeInTheDocument()
    })

    it("unverified user can sign out back to login", async () => {
        mockAuth.currentUser = { email: "x@example.com", emailVerified: false, reload: vi.fn() }
        renderPage()
        await userEvent.click(screen.getByRole("button", { name: /sign out/i }))
        expect(mockLogOut).toHaveBeenCalled()
        expect(screen.getByText("login page")).toBeInTheDocument()
    })
})
