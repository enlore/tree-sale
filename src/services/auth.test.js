import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { getToken, setToken, clearToken, isAuthenticated, login, TOKEN_KEY } from "./auth"

const makeToken = (exp) => {
    const payload = btoa(JSON.stringify({ email: "a@b.org", exp }))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
    return `header.${payload}.signature`
}

const futureExp = () => Math.floor(Date.now() / 1000) + 3600
const pastExp = () => Math.floor(Date.now() / 1000) - 3600

describe("token storage", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it("round-trips a token", () => {
        setToken("abc")
        expect(getToken()).toBe("abc")
        expect(localStorage.getItem(TOKEN_KEY)).toBe("abc")
    })

    it("clearToken removes the stored token", () => {
        setToken("abc")
        clearToken()
        expect(getToken()).toBeNull()
        expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    })
})

describe("isAuthenticated", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it("is false when no token is stored", () => {
        expect(isAuthenticated()).toBe(false)
    })

    it("is false when the token is expired", () => {
        setToken(makeToken(pastExp()))
        expect(isAuthenticated()).toBe(false)
    })

    it("is true when the token expires in the future", () => {
        setToken(makeToken(futureExp()))
        expect(isAuthenticated()).toBe(true)
    })

    it("is false when the token is not a decodable JWT", () => {
        setToken("not-a-jwt")
        expect(isAuthenticated()).toBe(false)
    })

    it("is false when the payload has no exp claim", () => {
        const payload = btoa(JSON.stringify({ email: "a@b.org" })).replace(/=+$/, "")
        setToken(`header.${payload}.signature`)
        expect(isAuthenticated()).toBe(false)
    })

    it("is false after clearToken", () => {
        setToken(makeToken(futureExp()))
        clearToken()
        expect(isAuthenticated()).toBe(false)
    })
})

describe("login", () => {
    beforeEach(() => {
        localStorage.clear()
        vi.stubEnv("VITE_API_URL", "http://api.test")
        global.fetch = vi.fn()
    })

    afterEach(() => {
        vi.unstubAllEnvs()
        vi.restoreAllMocks()
    })

    it("posts the credential to /api/login and returns the token", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ token: "app-jwt" }),
        })

        const token = await login("google-credential")

        expect(token).toBe("app-jwt")
        const [url, options] = global.fetch.mock.calls[0]
        expect(url).toBe("http://api.test/api/login")
        expect(options.method).toBe("POST")
        expect(options.headers["Content-Type"]).toBe("application/json")
        expect(JSON.parse(options.body)).toEqual({ credential: "google-credential" })
    })

    it("posts to a same-origin path when VITE_API_URL is unset", async () => {
        vi.stubEnv("VITE_API_URL", undefined)
        global.fetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ token: "app-jwt" }),
        })

        await login("google-credential")

        expect(global.fetch.mock.calls[0][0]).toBe("/api/login")
    })

    it("throws an error carrying the status on 403", async () => {
        global.fetch.mockResolvedValue({ ok: false, status: 403, json: () => Promise.resolve({}) })
        await expect(login("google-credential")).rejects.toMatchObject({ status: 403 })
    })

    it("throws an error carrying the status on 401", async () => {
        global.fetch.mockResolvedValue({ ok: false, status: 401, json: () => Promise.resolve({}) })
        await expect(login("google-credential")).rejects.toMatchObject({ status: 401 })
    })
})

describe("getUserEmail", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it("returns the email claim from the stored token", async () => {
        const { getUserEmail } = await import("./auth")
        setToken(makeToken(futureExp()))
        expect(getUserEmail()).toBe("a@b.org")
    })

    it("returns null when no token is stored", async () => {
        const { getUserEmail } = await import("./auth")
        expect(getUserEmail()).toBeNull()
    })

    it("returns null for a malformed token", async () => {
        const { getUserEmail } = await import("./auth")
        setToken("not-a-jwt")
        expect(getUserEmail()).toBeNull()
    })
})
