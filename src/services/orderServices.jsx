export const getAllOrders = () => {
    return fetch ('http://localhost:3000/api/orders').then((res) => res.json())
}