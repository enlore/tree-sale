import { clearToken, getToken } from "./auth"

export const authFetch = async (path) => {
    const token = getToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, { headers })

    if (res.status === 401) {
        clearToken()
        window.location.assign("/login")
        throw new Error("Unauthorized")
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

export const getSalesData = () => {
    return authFetch("/api/sales")
}
