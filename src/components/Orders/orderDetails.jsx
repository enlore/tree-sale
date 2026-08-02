import { getOrderById, getOrdersByCustomer } from "../../services/orderServices";
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

export const OrderDetails = () => {
    const { orderId } = useParams()
    const [order, setOrder] = useState(null)
    const [relatedOrders, setRelatedOrders] = useState([])

    useEffect(() => {
        getOrderById(orderId).then(setOrder)
    }, [orderId])

    useEffect(() => {
        if (order?.customerId) {
            getOrdersByCustomer(order.customerId).then((allCustomerOrders) => {
                // Exclude the current order from the "additional orders" list
                const others = allCustomerOrders.filter(o => o.id !== order.id)
                setRelatedOrders(others)
            })
        }
    }, [order])

    if (!order) return <p>Loading...</p>

    // Count how many of this homeowner's orders (including this one) are still pending
    const activeCount = [order, ...relatedOrders].filter(o => o.status === "PENDING").length

    // Combine current order + related orders, keep only unfulfilled ones
    const unfulfilledOrders = [order, ...relatedOrders].filter(o => o.status !== "FULFILLED")

    // Build a flat inventory list: exclude the planting service line item itself,
    // but tag each remaining item with whether its order requested planting
    const inventoryItems = unfulfilledOrders.flatMap(o =>
        o.items
            .filter(item => !item.name.toLowerCase().includes("planting"))
            .map(item => ({
                ...item,
                needsPlanting: o.includesPlanting,
                orderId: o.id
            }))
    )

    return (
        <section className="order-details-container">
            <div className="order-details-header">
                <h2 className="page-header">Order Details</h2>
                <button className="edit-btn">Edit</button>
            </div>

            <div className="order-details-card">
                <div className="detail-box status-box">Status: {order.status}</div>

                <div className="detail-box date-box">Date of Recent Order: {new Date(order.date).toLocaleDateString()}</div>
                <div className="detail-box active-orders-box">Active Orders: {activeCount}</div>
                <div className="detail-box total-orders-box">Total Orders: {relatedOrders.length + 1}</div>
                <div className="detail-box planting-box">Planting: {order.includesPlanting ? "Yes" : "No"}</div>

                <div className="order-details-middle">
                    <div className="order-details-left">
                        <div className="detail-box">Homeowner Name: {order.customerName}</div>
                        <div className="detail-box">Address: {order.address}, {order.city}, {order.state} {order.zipCode}</div>
                    </div>
                    <div className="detail-box notes-box">
                        Notes: {order.notes}
                    </div>
                </div>

                <div className="order-details-bottom">
                    <div className="detail-box">
                        <strong>Purchase(s):</strong>
                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index}>{item.name} - {new Date(order.date).toLocaleDateString()} - {order.status}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="detail-box">
                        <strong>Updated Inventory (all unfulfilled products in batch):</strong>
                        <ul>
                            {inventoryItems.map((item, index) => (
                                <li key={index}>
                                    {item.name} x{item.quantity} {item.needsPlanting ? "🌱" : ""}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {relatedOrders.length > 0 && (
                    <div className="detail-box additional-orders">
                        <strong>Additional Orders by {order.customerName}:</strong>
                        <ul>
                            {relatedOrders.map((relatedOrder) => (
                                <li key={relatedOrder.id}>
                                    <Link to={`/order/${relatedOrder.id}`}>
                                        {new Date(relatedOrder.date).toLocaleDateString()} — {relatedOrder.items.map(i => i.name).join(", ")} — ${relatedOrder.total}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    )
}