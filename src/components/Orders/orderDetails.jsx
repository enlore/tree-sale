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

    return (
        <section className="order-details-container">
            <div className="order-details-header">
                <h2 className="page-header">Order Details</h2>
                <button className="edit-btn">Edit</button>
            </div>

            <div className="order-details-card">
                <div className="order-details-top">
                    <div className="detail-box">Date of Last Updated Order: {new Date(order.date).toLocaleDateString()}</div>
                    <div className="detail-box">Total Orders: {relatedOrders.length + 1}</div>
                    <div className="detail-box">Status: {order.status}</div>
                </div>

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
                        <strong>Updated Inventory:</strong>
                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index}>{item.name}</li>
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