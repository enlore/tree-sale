import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Sales } from "./Sales"

const { mockGetSalesData } = vi.hoisted(() => ({ mockGetSalesData: vi.fn() }))

vi.mock("../../services/orderServices", () => ({ getSalesData: mockGetSalesData }))

function seasonPayload(overrides = {}) {
    return {
        season: "2026-2027",
        seasons: ["2026-2027", "2025-2026"],
        totalOrders: 42,
        fulfilledOrders: 30,
        unfulfilledOrders: 12,
        canceledOrders: 3,
        treesSold: 180,
        byTree: [
            { name: "Red Maple", quantity: 40 },
            { name: "Dogwood", quantity: 20 }
        ],
        ...overrides
    }
}

describe("Sales", () => {
    beforeEach(() => vi.clearAllMocks())

    it("shows the loading spinner until the sales data arrives", () => {
        mockGetSalesData.mockReturnValue(new Promise(() => {}))
        render(<Sales />)
        expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it("renders the summary and ranked tree list for the default season", async () => {
        mockGetSalesData.mockResolvedValue(seasonPayload())
        render(<Sales />)

        expect(await screen.findByText("Red Maple")).toBeInTheDocument()
        expect(screen.getByText("42")).toBeInTheDocument()
        expect(screen.getByText("30")).toBeInTheDocument()
        expect(screen.getByText("12")).toBeInTheDocument()
        expect(screen.getByText("3")).toBeInTheDocument()
        expect(screen.getByText("180")).toBeInTheDocument()
        expect(screen.getByText("40 sold")).toBeInTheDocument()
        expect(mockGetSalesData).toHaveBeenCalledWith(undefined)
    })

    it("offers every season in the dropdown", async () => {
        mockGetSalesData.mockResolvedValue(seasonPayload())
        render(<Sales />)

        await screen.findByText("Red Maple")
        const select = screen.getByLabelText(/season/i)
        expect([...select.options].map(o => o.value)).toEqual(["2026-2027", "2025-2026"])
        expect(select.value).toBe("2026-2027")
    })

    it("refetches and shows the spinner when a different season is selected", async () => {
        mockGetSalesData
            .mockResolvedValueOnce(seasonPayload())
            .mockResolvedValueOnce(seasonPayload({
                season: "2025-2026",
                totalOrders: 17,
                byTree: [{ name: "Dogwood", quantity: 9 }]
            }))
        render(<Sales />)

        await screen.findByText("Red Maple")
        await userEvent.selectOptions(screen.getByLabelText(/season/i), "2025-2026")

        expect(mockGetSalesData).toHaveBeenLastCalledWith("2025-2026")
        expect(await screen.findByText("17")).toBeInTheDocument()
        expect(screen.queryByText("Red Maple")).not.toBeInTheDocument()
    })

    it("shows an error message when the fetch fails", async () => {
        mockGetSalesData.mockRejectedValue(new Error("boom"))
        render(<Sales />)
        expect(await screen.findByText(/could not load sales/i)).toBeInTheDocument()
    })
})
