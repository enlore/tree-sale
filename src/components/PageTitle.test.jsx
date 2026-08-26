import { describe, it, expect, afterEach, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { PageTitle } from "./PageTitle"

describe("PageTitle", () => {
    afterEach(() => vi.unstubAllEnvs())

    it("renders the injected version after the title", () => {
        vi.stubEnv("VITE_APP_VERSION", "v0.5.0")
        render(<PageTitle>Tree Sale</PageTitle>)

        expect(screen.getByRole("heading", { name: "Tree Sale v0.5.0" })).toBeInTheDocument()
    })

    it("falls back to dev when no version is injected", () => {
        vi.stubEnv("VITE_APP_VERSION", "")
        render(<PageTitle>Tree Sale</PageTitle>)

        expect(screen.getByText("dev")).toBeInTheDocument()
    })
})
