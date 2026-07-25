export const getAllOrders = (status) => {
    const url = status
        ? `http://localhost:3000/api/orders?status=${status}`
        : `http://localhost:3000/api/orders`
    return fetch(url).then((res) => res.json())
}

export const getOrderById = (id) => {
    return fetch(
        `http://localhost:3000/api/orders/${id}`
    ).then(res=> res.json())
}

export const getOrdersByCustomer = (customerId) => {
    return fetch(`http://localhost:3000/api/customers/${customerId}/orders`)
        .then(res => res.json())
}