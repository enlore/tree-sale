import "./Orders.css"
import { getOrderById, getOrdersByCustomer } from "../../services/orderServices";
import { Loading } from "../Loading"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { StatusBadge } from "./StatusBadge"
import { SproutIcon } from "./SproutIcon"

const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

const summarizeItems = (items) =>
    items.map(item => item.quantity > 1 ? `${item.name} x${item.quantity}` : item.name).join(", ")

export const OrderDetails = () => {
    const { orderId } = useParams()
    const [order, setOrder] = useState(null)
    const [relatedOrders, setRelatedOrders] = useState([])
    const [copyState, setCopyState] = useState(null)

    const copyOrderId = () => {
        navigator.clipboard.writeText(order.id)
            .then(() => setCopyState("copied"))
            .catch(() => setCopyState("failed"))
            .then(() => setTimeout(() => setCopyState(null), 1500))
    }

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

    if (!order) {
        return (
            <section className="app-container">
                <Loading />
            </section>
        )
    }

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
        <section className="app-container order-details">
            <div className="order-details-header">
                <div className="order-details-title">
                    <h2 className="page-header">Order Details</h2>
                    <StatusBadge status={order.status} large />
                    <button
                        className="order-id"
                        onClick={copyOrderId}
                        aria-label="Copy order ID"
                        title="Copy order ID"
                    >
                        <span className="order-id-value">{order.id}</span>
                        {copyState === "copied" && <span className="order-id-copied">Copied</span>}
                        {copyState === "failed" && <span className="order-id-failed">Copy failed</span>}
                        {copyState === null && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        )}
                    </button>
                </div>
                <button className="edit-btn">Edit</button>
            </div>

            <div className="stat-tiles">
                <div className="stat-tile">
                    <span className="box-label">RECENT ORDER</span>
                    <span className="stat-value">{formatDate(order.date)}</span>
                </div>
                <div className="stat-tile">
                    <span className="box-label">ACTIVE ORDERS</span>
                    <span className="stat-value">{activeCount}</span>
                </div>
                <div className="stat-tile">
                    <span className="box-label">TOTAL ORDERS</span>
                    <span className="stat-value">{relatedOrders.length + 1}</span>
                </div>
                <div className="stat-tile">
                    <span className="box-label">PLANTING</span>
                    <div className="stat-value-row">
                        {order.includesPlanting && <SproutIcon size={20} />}
                        <span className="stat-value">{order.includesPlanting ? "Yes" : "No"}</span>
                    </div>
                </div>
            </div>

            <div className="detail-grid">
                <div className="detail-box">
                    <span className="box-label">HOMEOWNER</span>
                    <span className="homeowner-name">{order.customerName}</span>
                    <span className="detail-text">{order.address}, {order.city}, {order.state} {order.zipCode}</span>
                </div>
                <div className="detail-box">
                    <span className="box-label">NOTES</span>
                    <span className="detail-text">{order.notes}</span>
                </div>
            </div>

            <div className="detail-grid">
                <div className="detail-box detail-list">
                    <span className="box-label">PURCHASES</span>
                    {order.items.map((item, index) => (
                        <div key={index} className="line-row">
                            <span className="line-name">{item.name}</span>
                            <span className="line-date">{formatDate(order.date)}</span>
                        </div>
                    ))}
                </div>
                <div className="detail-box detail-list">
                    <span className="box-label">UNFULFILLED INVENTORY (THIS BATCH)</span>
                    {inventoryItems.map((item, index) => (
                        <div key={index} className="line-row">
                            <div className="line-name-group">
                                <span className="line-name">{item.name}</span>
                                {item.needsPlanting && <SproutIcon />}
                            </div>
                            <span className="line-qty">x{item.quantity}</span>
                        </div>
                    ))}
                </div>
            </div>

            {relatedOrders.length > 0 && (
                <div className="detail-box detail-list">
                    <span className="box-label">ADDITIONAL ORDERS BY {order.customerName.toUpperCase()}</span>
                    {relatedOrders.map((relatedOrder) => (
                        <div key={relatedOrder.id} className="related-row">
                            <Link to={`/order/${relatedOrder.id}`} className="related-link">
                                {formatDate(relatedOrder.date)} · {summarizeItems(relatedOrder.items)} · ${relatedOrder.total}
                            </Link>
                            <StatusBadge status={relatedOrder.status} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
