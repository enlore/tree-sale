import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { UiExpo } from "./UiExpo"

describe("UiExpo", () => {
    it("displays the loading indicator", () => {
        render(<UiExpo />)

        expect(screen.getByText("Loading...")).toBeInTheDocument()
        expect(screen.getByRole("heading", { name: /ui expo/i })).toBeInTheDocument()
    })

    it("displays the error samples", () => {
        render(<UiExpo />)

        expect(screen.getByText("Rate limit exceeded. Retry in 30 seconds.")).toBeInTheDocument()
        expect(screen.getByText("Could not load sales data. Try again in a moment.")).toBeInTheDocument()
    })
})
