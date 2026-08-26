import { describe, it, expect } from "vitest"
import { seasonOf, seasonsOf } from "./season"

describe("seasonOf", () => {
    it("starts a season on July 1", () => {
        expect(seasonOf("2026-07-01T00:00:00Z")).toBe("2026-2027")
    })

    it("ends a season on June 30", () => {
        expect(seasonOf("2026-06-30T23:59:59Z")).toBe("2025-2026")
    })
})

describe("seasonsOf", () => {
    it("lists distinct seasons newest first", () => {
        const orders = [
            { date: "2025-10-01T00:00:00Z" },
            { date: "2026-11-15T00:00:00Z" },
            { date: "2026-03-02T00:00:00Z" }
        ]
        expect(seasonsOf(orders)).toEqual(["2026-2027", "2025-2026"])
    })
})
