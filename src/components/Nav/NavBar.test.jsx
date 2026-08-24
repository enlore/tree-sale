import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { NavBar } from "./NavBar"

const { mockGetUserEmail, mockLogOut } = vi.hoisted(() => ({
    mockGetUserEmail: vi.fn(),
    mockLogOut: vi.fn(),
}))

vi.mock("../../services/auth", () => ({
    getUserEmail: mockGetUserEmail,
    logOut: mockLogOut,
}))

const renderNavBar = () =>
    render(
        <MemoryRouter>
            <NavBar />
        </MemoryRouter>
    )

describe("NavBar greeting", () => {
    beforeEach(() => {
        mockGetUserEmail.mockReset()
        mockLogOut.mockReset()
    })

    it("greets the logged-in email", () => {
        mockGetUserEmail.mockReturnValue("dana@treeconservationcorps.org")
        renderNavBar()

        expect(screen.getByText(/hi dana@treeconservationcorps\.org/i)).toBeInTheDocument()
    })

    it("renders no greeting without a token", () => {
        mockGetUserEmail.mockReturnValue(null)
        renderNavBar()

        expect(screen.queryByText(/^hi /i)).not.toBeInTheDocument()
    })
})
