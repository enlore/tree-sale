import "./Orders.css"
import { useState, useEffect } from "react"
import { getSalesData } from "../../services/orderServices"

export const Sales = () => {
    const [sales, setSales] = useState([])

    useEffect(() => {
        getSalesData().then(setSales)
    }, [])

    const ranked = [...sales].sort((a, b) => b.quantity - a.quantity)
    const maxQuantity = ranked.length > 0 ? ranked[0].quantity : 0

    return (
        <div className="app-container">
            <h1 className="page-title">Tree Sale</h1>
            <h2 className="page-header sales-heading">Sales: Most to Least Sold</h2>

            <ol className="sales-list">
                {ranked.map((item, index) => (
                    <li key={item.name} className="sales-row">
                        <span className="sales-rank">{index + 1}</span>
                        <span className="sales-name">{item.name}</span>
                        <div className="sales-track">
                            <div
                                className="sales-fill"
                                style={{ width: maxQuantity > 0 ? `${(item.quantity / maxQuantity) * 100}%` : 0 }}
                            ></div>
                        </div>
                        <span className="sales-count">{item.quantity} sold</span>
                    </li>
                ))}
            </ol>
        </div>
    )
}
