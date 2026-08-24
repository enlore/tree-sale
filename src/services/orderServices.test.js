import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const { mockGetIdToken, mockLogOut } = vi.hoisted(() => ({
    mockGetIdToken: vi.fn(),
    mockLogOut: vi.fn()
}))

vi.mock("./auth", () => ({
    getIdToken: mockGetIdToken,
    logOut: mockLogOut
}))

import { authFetch, getAllOrders, getOrderById, getOrdersByCustomer, getSalesData } from "./orderServices.jsx"

let originalLocation
let assign

const stubLocation = () => {
    originalLocation = window.location
    assign = vi.fn()
    Object.defineProperty(window, "location", {
        configurable: true,
        writable: true,
        value: { ...originalLocation, assign },
    })
}

const restoreLocation = () => {
    Object.defineProperty(window, "location", {
        configurable: true,
        writable: true,
        value: originalLocation,
    })
}

const okResponse = (body) => ({ ok: true, status: 200, json: () => Promise.resolve(body) })

describe("authFetch", () => {
    beforeEach(() => {
        vi.stubEnv("VITE_API_URL", "http://api.test")
        mockGetIdToken.mockResolvedValue("firebase-token")
        mockLogOut.mockResolvedValue()
        global.fetch = vi.fn()
        stubLocation()
    })

    afterEach(() => {
        restoreLocation()
        vi.unstubAllEnvs()
        vi.restoreAllMocks()
        vi.clearAllMocks()
    })

    it("prepends the API url and attaches the Firebase ID token as a Bearer header", async () => {
        global.fetch.mockResolvedValue(okResponse([{ id: 1 }]))

        const data = await authFetch("/api/orders")

        expect(data).toEqual([{ id: 1 }])
        const [url, options] = global.fetch.mock.calls[0]
        expect(url).toBe("http://api.test/api/orders")
        expect(options.headers.Authorization).toBe("Bearer firebase-token")
    })

    it("falls back to a same-origin path when VITE_API_URL is unset", async () => {
        vi.stubEnv("VITE_API_URL", undefined)
        global.fetch.mockResolvedValue(okResponse([]))

        await authFetch("/api/orders")

        expect(global.fetch.mock.calls[0][0]).toBe("/api/orders")
    })

    it("redirects to /login without calling the API when there is no user", async () => {
        mockGetIdToken.mockResolvedValue(null)

        await expect(authFetch("/api/orders")).rejects.toThrow("Unauthorized")

        expect(assign).toHaveBeenCalledWith("/login")
        expect(global.fetch).not.toHaveBeenCalled()
    })

    it("signs out and redirects to /login on a 401", async () => {
        global.fetch.mockResolvedValue({ ok: false, status: 401, json: () => Promise.resolve({}) })

        await expect(authFetch("/api/orders")).rejects.toThrow("Unauthorized")

        expect(mockLogOut).toHaveBeenCalled()
        expect(assign).toHaveBeenCalledWith("/login")
    })

    it("redirects to /pending-access on a 403 without signing out", async () => {
        global.fetch.mockResolvedValue({ ok: false, status: 403, json: () => Promise.resolve({}) })

        await expect(authFetch("/api/orders")).rejects.toThrow("Forbidden")

        expect(assign).toHaveBeenCalledWith("/pending-access")
        expect(mockLogOut).not.toHaveBeenCalled()
    })

    it("throws on other non-ok statuses without redirecting", async () => {
        global.fetch.mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) })

        await expect(authFetch("/api/orders")).rejects.toThrow("failed with status 500")

        expect(assign).not.toHaveBeenCalled()
    })
})

describe("order service requests", () => {
    beforeEach(() => {
        vi.stubEnv("VITE_API_URL", "http://api.test")
        mockGetIdToken.mockResolvedValue("firebase-token")
        global.fetch = vi.fn().mockResolvedValue(okResponse([]))
        stubLocation()
    })

    afterEach(() => {
        restoreLocation()
        vi.unstubAllEnvs()
        vi.restoreAllMocks()
        vi.clearAllMocks()
    })

    it("getAllOrders requests every order when no status is given", async () => {
        await getAllOrders()
        expect(global.fetch.mock.calls[0][0]).toBe("http://api.test/api/orders")
    })

    it("getAllOrders filters by status when one is given", async () => {
        await getAllOrders("PENDING")
        expect(global.fetch.mock.calls[0][0]).toBe("http://api.test/api/orders?status=PENDING")
    })

    it("getOrderById requests a single order", async () => {
        await getOrderById(7)
        expect(global.fetch.mock.calls[0][0]).toBe("http://api.test/api/orders/7")
    })

    it("getOrdersByCustomer requests a customer's orders", async () => {
        await getOrdersByCustomer(42)
        expect(global.fetch.mock.calls[0][0]).toBe("http://api.test/api/customers/42/orders")
    })

    it("getSalesData requests the sales report", async () => {
        await getSalesData()
        expect(global.fetch.mock.calls[0][0]).toBe("http://api.test/api/sales")
    })

    it("getSalesData scopes the report to a season when given one", async () => {
        await getSalesData("2025-2026")
        expect(global.fetch.mock.calls[0][0]).toBe("http://api.test/api/sales?season=2025-2026")
    })
})
