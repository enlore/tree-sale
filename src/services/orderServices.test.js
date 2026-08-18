import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { authFetch, getAllOrders, getOrderById, getOrdersByCustomer, getSalesData } from "./orderServices"
import { setToken, getToken } from "./auth"

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
        localStorage.clear()
        vi.stubEnv("VITE_API_URL", "http://api.test")
        global.fetch = vi.fn()
        stubLocation()
    })

    afterEach(() => {
        restoreLocation()
        vi.unstubAllEnvs()
        vi.restoreAllMocks()
    })

    it("prepends the API url and attaches the bearer token", async () => {
        setToken("app-jwt")
        global.fetch.mockResolvedValue(okResponse([{ id: 1 }]))

        const data = await authFetch("/api/orders")

        expect(data).toEqual([{ id: 1 }])
        const [url, options] = global.fetch.mock.calls[0]
        expect(url).toBe("http://api.test/api/orders")
        expect(options.headers.Authorization).toBe("Bearer app-jwt")
    })

    it("falls back to a same-origin path when VITE_API_URL is unset", async () => {
        vi.stubEnv("VITE_API_URL", undefined)
        global.fetch.mockResolvedValue(okResponse([]))

        await authFetch("/api/orders")

        expect(global.fetch.mock.calls[0][0]).toBe("/api/orders")
    })

    it("sends no Authorization header when there is no token", async () => {
        global.fetch.mockResolvedValue(okResponse([]))

        await authFetch("/api/orders")

        const [, options] = global.fetch.mock.calls[0]
        expect(options.headers.Authorization).toBeUndefined()
    })

    it("clears the token and redirects to /login on 401", async () => {
        setToken("app-jwt")
        global.fetch.mockResolvedValue({ ok: false, status: 401, json: () => Promise.resolve({}) })

        await expect(authFetch("/api/orders")).rejects.toThrow()

        expect(getToken()).toBeNull()
        expect(assign).toHaveBeenCalledWith("/login")
    })

    it("throws on a non-401 error response without clearing the token", async () => {
        setToken("app-jwt")
        global.fetch.mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) })

        await expect(authFetch("/api/orders")).rejects.toThrow()

        expect(getToken()).toBe("app-jwt")
        expect(assign).not.toHaveBeenCalled()
    })
})

describe("order service requests", () => {
    beforeEach(() => {
        localStorage.clear()
        vi.stubEnv("VITE_API_URL", "http://api.test")
        setToken("app-jwt")
        global.fetch = vi.fn().mockResolvedValue(okResponse([]))
        stubLocation()
    })

    afterEach(() => {
        restoreLocation()
        vi.unstubAllEnvs()
        vi.restoreAllMocks()
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
})
