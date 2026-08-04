import "./Orders.css"
import { useState, useEffect } from "react"
import { getSalesData } from "../../services/orderServices"

export const Sales = () => {
    const [sales, setSales] = useState([])

    useEffect(() => {
        getSalesData().then(setSales)
    }, [])

    return (
        <div className="app-container">
            <h1 className="page-title">Tree Sale</h1>
            <h2 className="page-header">Sales — Most to Least Sold</h2>

            <ol className="sales-list">
                {sales.map((item) => (
                    <li key={item.name} className="sales-item">
                        <span className="sales-name">{item.name}</span>
                        <span className="sales-count">{item.quantity} sold</span>
                    </li>
                ))}
            </ol>
        </div>
    )
}