import { getIdToken, logOut } from "./auth"

export const authFetch = async (path) => {
    const token = await getIdToken()

    if (!token) {
        window.location.assign("/login")
        throw new Error("Unauthorized")
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL ?? ""}${path}`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    if (res.status === 401) {
        await logOut()
        window.location.assign("/login")
        throw new Error("Unauthorized")
    }

    if (res.status === 403) {
        window.location.assign("/pending-access")
        throw new Error("Forbidden")
    }

    if (!res.ok) {
        throw new Error(`Request to ${path} failed with status ${res.status}`)
    }

    return res.json()
}

export const getAllOrders = (status) => {
    return authFetch(status ? `/api/orders?status=${status}` : "/api/orders")
}

export const getOrderById = (id) => {
    return authFetch(`/api/orders/${id}`)
}

export const getOrdersByCustomer = (customerId) => {
    return authFetch(`/api/customers/${customerId}/orders`)
}

export const getSalesData = (season) => {
    return authFetch(season ? `/api/sales?season=${season}` : "/api/sales")
}
