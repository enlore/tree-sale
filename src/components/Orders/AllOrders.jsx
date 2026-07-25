import "./Orders.css"
import { useState, useEffect } from "react"
import { getAllOrders } from "../../services/orderServices"
import { SearchBar } from "./SearchBar"
import { Order } from "./Order"

export const AllOrders = ({ statusFilter, pageTitle }) => {
    const [orders, setOrders] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredOrders, setFilteredOrders] = useState([])
    const [groupBy, setGroupBy] = useState("none")

    useEffect(() => {
        getAllOrders(statusFilter).then((orderArray) => {
            setOrders(orderArray)
        })
    }, [statusFilter])

    useEffect(() => {
        let filtered = orders

        if (searchTerm !== "") {
            filtered = filtered.filter(order =>
                order.customerName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        }

        setFilteredOrders(filtered)
    }, [orders, searchTerm])

    const groupedOrders = () => {
        if (groupBy === "none") {
            return { "All Orders": filteredOrders }
        }

        const groups = {}

        for (const order of filteredOrders) {
            const key = groupBy === "zip" ? order.zipCode : order.customerId

            if (!groups[key]) {
                groups[key] = []
            }
            groups[key].push(order)
        }

        return groups
    }

    const groups = groupedOrders()

    return (
    <div className="app-container">
        <h1 className="page-title">Tree Sale</h1>

        <div className="controls-row">
            <h2 className="page-header">{pageTitle}</h2>

            <div className="controls-right">
                <select
                    id="groupBy"
                    className="group-filter"
                    value={groupBy}
                    onChange={(event) => setGroupBy(event.target.value)}
                >
                    <option value="none">Filter Drop-down</option>
                    <option value="zip">Zip Code (Proximity)</option>
                    <option value="homeowner">Homeowner</option>
                </select>

                <SearchBar setSearchTerm={setSearchTerm} />
            </div>
        </div>

        {Object.entries(groups).map(([groupKey, groupOrders]) => (
            <div key={groupKey} className="order-group">
                {groupBy !== "none" && (
                    <h3 className="group-heading">
                        {groupBy === "zip" ? `Zip Code: ${groupKey}` : `Homeowner: ${groupOrders[0].customerName}`}
                    </h3>
                )}
                <div className="order-list">
                    {groupOrders.map((orderObj) => (
                        <Order key={orderObj.id} order={orderObj} />
                    ))}
                </div>
            </div>
        ))}
    </div>
)}