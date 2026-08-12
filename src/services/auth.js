export const TOKEN_KEY = "tree-sale-token"

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)

export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

const expiresAt = (token) => {
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")
        const { exp } = JSON.parse(atob(padded))
        return typeof exp === "number" ? exp : null
    } catch {
        return null
    }
}

export const isAuthenticated = () => {
    const token = getToken()
    if (!token) {
        return false
    }
    const exp = expiresAt(token)
    return exp !== null && exp * 1000 > Date.now()
}

export const login = async (credential) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
    })

    if (!res.ok) {
        const error = new Error(`Login failed with status ${res.status}`)
        error.status = res.status
        throw error
    }

    const { token } = await res.json()
    return token
}
