import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Order } from "./Order"

const testOrder = {
    id: "6f2b9c41e8d3a05517f04c2e",
    customerName: "Dana Whitfield",
    city: "Nashville",
    state: "TN",
    zipCode: "37206",
    date: "2026-11-14T12:00:00.000Z",
    status: "PENDING",
    includesPlanting: false,
    totalQuantity: 2
}

describe("Order card", () => {
    it("shows the order id", () => {
        render(
            <MemoryRouter>
                <Order order={testOrder} />
            </MemoryRouter>
        )

        expect(screen.getByText(testOrder.id)).toBeInTheDocument()
    })
})
