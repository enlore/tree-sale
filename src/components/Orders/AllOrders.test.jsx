import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { AllOrders } from "./AllOrders"

const { mockGetAllOrders } = vi.hoisted(() => ({ mockGetAllOrders: vi.fn() }))

vi.mock("../../services/orderServices", () => ({ getAllOrders: mockGetAllOrders }))

const order = (id, date) => ({
    id,
    customerId: `cust-${id}`,
    customerName: `Customer ${id}`,
    city: "Nashville",
    state: "TN",
    zipCode: "37206",
    date,
    status: "PENDING",
    includesPlanting: false,
    hasDiscount: false,
    items: [],
    totalQuantity: 1,
    total: "50.00"
})

const renderAllOrders = () => render(
    <MemoryRouter>
        <AllOrders pageTitle="All Orders" />
    </MemoryRouter>
)

describe("AllOrders season filter", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetAllOrders.mockResolvedValue([
            order("this-season", "2026-11-14T12:00:00.000Z"),
            order("last-season", "2025-10-02T12:00:00.000Z")
        ])
    })

    it("lists every season present in the orders, newest first, and shows all by default", async () => {
        renderAllOrders()

        expect(await screen.findByText("this-season")).toBeInTheDocument()
        expect(screen.getByText("last-season")).toBeInTheDocument()

        const options = screen.getAllByRole("option", { name: /^\d{4}-\d{4}$/ })
        expect(options.map((option) => option.value)).toEqual(["2026-2027", "2025-2026"])
    })

    it("narrows the list to the chosen season", async () => {
        renderAllOrders()
        await screen.findByText("this-season")

        const seasonSelect = screen.getByRole("combobox", { name: /season/i })
        await userEvent.selectOptions(seasonSelect, "2025-2026")

        expect(screen.getByText("last-season")).toBeInTheDocument()
        expect(screen.queryByText("this-season")).not.toBeInTheDocument()
    })
})
