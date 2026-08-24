import "./Orders.css"
import { useState, useEffect } from "react"
import { getSalesData } from "../../services/orderServices"
import { Loading } from "../Loading"

export const Sales = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)

    const loadSeason = (season) => {
        setLoading(true)
        setFailed(false)
        getSalesData(season)
            .then((payload) => setData(payload))
            .catch(() => setFailed(true))
            .finally(() => setLoading(false))
    }

    useEffect(() => loadSeason(undefined), [])

    const seasons = data
        ? (data.seasons.includes(data.season) ? data.seasons : [data.season, ...data.seasons])
        : []
    const maxQuantity = data?.byTree[0]?.quantity ?? 0

    return (
        <div className="app-container">
            <h1 className="page-title">Tree Sale</h1>
            <div className="sales-header">
                <h2 className="page-header sales-heading">Sales</h2>
                {data && (
                    <label className="season-picker">
                        Season
                        <select value={data.season} onChange={(event) => loadSeason(event.target.value)}>
                            {seasons.map((season) => (
                                <option key={season} value={season}>{season}</option>
                            ))}
                        </select>
                    </label>
                )}
            </div>

            {failed && <p className="sales-error">Could not load sales data. Try again in a moment.</p>}

            {loading ? (
                <Loading />
            ) : (
                data && !failed && (
                    <>
                        <section className="sales-summary">
                            <div className="summary-stat">
                                <span className="summary-value">{data.totalOrders}</span>
                                <span className="summary-label">Orders submitted</span>
                            </div>
                            <div className="summary-stat">
                                <span className="summary-value">{data.fulfilledOrders}</span>
                                <span className="summary-label">Fulfilled</span>
                            </div>
                            <div className="summary-stat">
                                <span className="summary-value">{data.unfulfilledOrders}</span>
                                <span className="summary-label">Not fulfilled</span>
                            </div>
                            <div className="summary-stat">
                                <span className="summary-value">{data.canceledOrders}</span>
                                <span className="summary-label">Canceled</span>
                            </div>
                            <div className="summary-stat">
                                <span className="summary-value">{data.treesSold}</span>
                                <span className="summary-label">Trees sold</span>
                            </div>
                        </section>

                        <h3 className="sales-heading">Most to Least Sold</h3>
                        <ol className="sales-list">
                            {data.byTree.map((item, index) => (
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
                    </>
                )
            )}
        </div>
    )
}
