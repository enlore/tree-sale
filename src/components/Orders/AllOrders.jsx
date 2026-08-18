import "./Orders.css"
import { useState, useEffect } from "react"
import { getAllOrders } from "../../services/orderServices"
import { SearchBar } from "./SearchBar"
import { Order } from "./Order"

const sortOrders = (orders, sortOption) => {
    const sorted = [...orders]
    if (sortOption === "zip") {
        sorted.sort((a, b) => String(a.zipCode).localeCompare(String(b.zipCode)))
    } else if (sortOption === "homeowner") {
        sorted.sort((a, b) => a.customerName.localeCompare(b.customerName))
    } else {
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
    return sorted
}

export const AllOrders = ({ statusFilter, pageTitle }) => {
    const [orders, setOrders] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterOption, setFilterOption] = useState("none")
    const [sortOption, setSortOption] = useState("newest")

    useEffect(() => {
        getAllOrders(statusFilter).then((orderArray) => {
            setOrders(orderArray)
        })
    }, [statusFilter])

    let filtered = orders

    if (searchTerm !== "") {
        filtered = filtered.filter(order =>
            order.customerName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
    }

    if (filterOption === "planting") {
        filtered = filtered.filter(order => order.includesPlanting)
    }

    if (filterOption === "discount") {
        filtered = filtered.filter(order => order.hasDiscount)
    }

    const filteredOrders = sortOrders(filtered, sortOption)

    return (
    <div className="app-container">
        <h1 className="page-title">Tree Sale</h1>

        <div className="controls-row">
            <h2 className="page-header">{pageTitle}</h2>

            <div className="controls-right">
                <label className="control-select">
                    <span className="control-select-label">Filter</span>
                    <select
                        value={filterOption}
                        onChange={(event) => setFilterOption(event.target.value)}
                    >
                        <option value="none">All orders</option>
                        <option value="planting">Planting requested</option>
                        <option value="discount">Discount used</option>
                    </select>
                </label>

                <label className="control-select">
                    <span className="control-select-label">Sort</span>
                    <select
                        value={sortOption}
                        onChange={(event) => setSortOption(event.target.value)}
                    >
                        <option value="newest">Newest first</option>
                        <option value="zip">Zip proximity</option>
                        <option value="homeowner">Homeowner</option>
                    </select>
                </label>

                <SearchBar setSearchTerm={setSearchTerm} />
            </div>
        </div>

        <div className="order-list">
            {filteredOrders.map((orderObj) => (
                <Order key={orderObj.id} order={orderObj} />
            ))}
        </div>
    </div>
)}
