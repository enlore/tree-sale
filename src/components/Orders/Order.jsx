import "./Orders.css"
import { Link } from "react-router-dom"

export const Order = ({order}) => {
    return (
        <article className="order-card">
            <Link to={`/order/${order.id}`}
            className="order-link">
                <h2 className="order-date">{new Date(order.date).toLocaleDateString()}</h2>
                <p>{order.customerName}, {order.city}, {order.state} {order.zipCode}</p>
                <p>Quantity: {order.totalQuantity}</p>
            </Link>
        </article>
    )
}