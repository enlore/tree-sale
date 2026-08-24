import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ErrorMessage } from "./ErrorMessage"

describe("ErrorMessage", () => {
    it("shows the message it is given", () => {
        render(<ErrorMessage>Rate limit exceeded.</ErrorMessage>)

        expect(screen.getByText("Rate limit exceeded.")).toBeInTheDocument()
    })
})
