const BASE_URL = "http://localhost:3000"  // ← we'll change this to the Render URL in Step 5

export const getAllOrders = (status) => {
    const url = status
        ? `${BASE_URL}/api/orders?status=${status}`
        : `${BASE_URL}/api/orders`
    return fetch(url).then((res) => res.json())
}

export const getOrderById = (id) => {
    return fetch(
        `${BASE_URL}/api/orders/${id}`
    ).then(res=> res.json())
}

export const getOrdersByCustomer = (customerId) => {
    return fetch(`${BASE_URL}/api/customers/${customerId}/orders`)
        .then(res => res.json())
}

export const getSalesData = () => {
    return fetch('${BASE_URL}/api/sales')
        .then(res => res.json())
}