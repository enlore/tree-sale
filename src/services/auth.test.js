import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockAuth, mockOnAuthStateChanged, mockSignInWithPopup, mockSignOut, mockSendEmailVerification } = vi.hoisted(() => ({
    mockAuth: { currentUser: null },
    mockOnAuthStateChanged: vi.fn(),
    mockSignInWithPopup: vi.fn(),
    mockSignOut: vi.fn(),
    mockSendEmailVerification: vi.fn()
}))

vi.mock("firebase/auth", () => ({
    onAuthStateChanged: mockOnAuthStateChanged,
    signInWithPopup: mockSignInWithPopup,
    signOut: mockSignOut,
    sendEmailVerification: mockSendEmailVerification
}))

vi.mock("./firebase", () => ({
    auth: mockAuth,
    googleProvider: { providerId: "google.com" },
    microsoftProvider: { providerId: "microsoft.com" }
}))

describe("auth service", () => {
    beforeEach(() => {
        vi.resetModules()
        vi.clearAllMocks()
        mockAuth.currentUser = null
        // Default: auth resolves on the next microtask with no user
        mockOnAuthStateChanged.mockImplementation((auth, cb) => {
            Promise.resolve().then(() => cb(auth.currentUser))
            return () => {}
        })
    })

    it("getIdToken returns null when no one is signed in", async () => {
        const { getIdToken } = await import("./auth.js")
        expect(await getIdToken()).toBeNull()
    })

    it("getIdToken returns the user token after auth restores", async () => {
        mockAuth.currentUser = { getIdToken: vi.fn().mockResolvedValue("firebase-token") }
        const { getIdToken } = await import("./auth.js")
        expect(await getIdToken()).toBe("firebase-token")
    })

    it("getIdToken passes forceRefresh through", async () => {
        const getIdTokenMock = vi.fn().mockResolvedValue("fresh")
        mockAuth.currentUser = { getIdToken: getIdTokenMock }
        const { getIdToken } = await import("./auth.js")
        await getIdToken(true)
        expect(getIdTokenMock).toHaveBeenCalledWith(true)
    })

    it("getUserEmail reflects the current user", async () => {
        mockAuth.currentUser = { email: "staff@treeconservationcorps.org" }
        const { getUserEmail } = await import("./auth.js")
        expect(getUserEmail()).toBe("staff@treeconservationcorps.org")
    })

    it("signInWithGoogle and signInWithMicrosoft pop the right providers", async () => {
        const { signInWithGoogle, signInWithMicrosoft } = await import("./auth.js")
        await signInWithGoogle()
        await signInWithMicrosoft()
        expect(mockSignInWithPopup).toHaveBeenNthCalledWith(1, mockAuth, { providerId: "google.com" })
        expect(mockSignInWithPopup).toHaveBeenNthCalledWith(2, mockAuth, { providerId: "microsoft.com" })
    })

    it("logOut signs out of Firebase", async () => {
        const { logOut } = await import("./auth.js")
        await logOut()
        expect(mockSignOut).toHaveBeenCalledWith(mockAuth)
    })

    it("sendVerificationEmail targets the current user", async () => {
        mockAuth.currentUser = { email: "x@example.com" }
        const { sendVerificationEmail } = await import("./auth.js")
        await sendVerificationEmail()
        expect(mockSendEmailVerification).toHaveBeenCalledWith(mockAuth.currentUser)
    })
})
