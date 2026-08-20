import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { OrderDetails } from "./orderDetails"

vi.mock("../../services/orderServices", () => ({
    getOrderById: vi.fn(),
    getOrdersByCustomer: vi.fn()
}))

import { getOrderById, getOrdersByCustomer } from "../../services/orderServices"

const testOrder = {
    id: "6f2b9c41e8d3a05517f04c2e",
    customerId: "cust-1",
    customerName: "Dana Whitfield",
    address: "1421 Holly St",
    city: "Nashville",
    state: "TN",
    zipCode: "37206",
    date: "2026-11-14T12:00:00.000Z",
    status: "PENDING",
    includesPlanting: true,
    hasDiscount: false,
    notes: "Gate code 4415",
    items: [{ name: "Red Maple", quantity: 2, price: "45.00" }],
    totalQuantity: 2,
    total: "90.00"
}

const renderDetails = () =>
    render(
        <MemoryRouter initialEntries={[`/order/${testOrder.id}`]}>
            <Routes>
                <Route path="/order/:orderId" element={<OrderDetails />} />
            </Routes>
        </MemoryRouter>
    )

describe("OrderDetails order id", () => {
    beforeEach(() => {
        getOrderById.mockResolvedValue(testOrder)
        getOrdersByCustomer.mockResolvedValue([testOrder])
        Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue() } })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("shows the order id", async () => {
        renderDetails()

        expect(await screen.findByText(testOrder.id)).toBeInTheDocument()
    })

    it("copies the order id to the clipboard on click and confirms", async () => {
        renderDetails()

        fireEvent.click(await screen.findByRole("button", { name: /copy order id/i }))

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testOrder.id)
        expect(await screen.findByText(/copied/i)).toBeInTheDocument()
    })

    it("shows failure feedback when the clipboard write rejects", async () => {
        navigator.clipboard.writeText.mockRejectedValue(new Error("denied"))
        renderDetails()

        fireEvent.click(await screen.findByRole("button", { name: /copy order id/i }))

        expect(await screen.findByText(/copy failed/i)).toBeInTheDocument()
    })
})
