import "./Orders.css"
import { Link } from "react-router-dom"
import { StatusBadge } from "./StatusBadge"
import { SproutIcon } from "./SproutIcon"

const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export const Order = ({order}) => {
    return (
        <article className="order-card">
            <Link to={`/order/${order.id}`}
            className="order-link">
                <div className="order-card-content">
                    <div className="order-title-row">
                        <span className="order-date">{formatDate(order.date)}</span>
                        <StatusBadge status={order.status} />
                        <span className="order-row-id">{order.id}</span>
                    </div>
                    <span className="order-customer">
                        {order.customerName} · {order.city}, {order.state} {order.zipCode}
                    </span>
                    {order.includesPlanting ? (
                        <div className="order-planting">
                            <SproutIcon />
                            <span>Planting requested</span>
                        </div>
                    ) : (
                        <div className="order-no-planting">
                            <span>No planting</span>
                        </div>
                    )}
                </div>
                <div className="order-card-right">
                    <span className="order-quantity">
                        {order.totalQuantity} {order.totalQuantity === 1 ? "tree" : "trees"}
                    </span>
                    <svg className="order-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
                </div>
            </Link>
        </article>
    )
}
