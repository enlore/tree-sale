import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Loading } from "./Loading"

describe("Loading", () => {
    it("shows the shield logo and loading text", () => {
        render(<Loading />)

        expect(screen.getByText("Loading...")).toBeInTheDocument()
        expect(screen.getByRole("img", { name: /nashville tree conservation corps/i })).toBeInTheDocument()
    })
})
