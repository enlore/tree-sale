import "./Orders.css"
import { useState, useEffect } from "react"
import { getAllOrders } from "../../services/orderServices"
import { SearchBar } from "./SearchBar"
import { Order } from "./Order"
import { SproutIcon } from "./SproutIcon"
import { Loading } from "../Loading"
import { PageTitle } from "../PageTitle"
import { ErrorMessage } from "../ErrorMessage"
import { seasonOf, seasonsOf } from "../../services/season"

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

const emptyMessage = (statusFilter) => {
    if (statusFilter === "PENDING") return "No pending orders."
    if (statusFilter === "FULFILLED") return "No fulfilled orders."
    return "No orders yet."
}

export const AllOrders = ({ statusFilter, pageTitle }) => {
    const [orders, setOrders] = useState([])
    const [loadedFor, setLoadedFor] = useState(null)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterOption, setFilterOption] = useState("none")
    const [seasonOption, setSeasonOption] = useState(null)
    const [sortOption, setSortOption] = useState("newest")

    useEffect(() => {
        setError(null)
        getAllOrders(statusFilter)
            .then((orderArray) => {
                setOrders(orderArray)
                setSeasonOption(seasonsOf(orderArray)[0] ?? null)
                setLoadedFor(statusFilter ?? "ALL")
            })
            .catch((err) => setError(err.message))
    }, [statusFilter])

    const loaded = loadedFor === (statusFilter ?? "ALL")
    const seasons = seasonsOf(orders)

    let filtered = seasonOption ? orders.filter(order => seasonOf(order.date) === seasonOption) : orders

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
        <PageTitle>Tree Sale</PageTitle>

        <div className="controls-row">
            <h2 className="page-header">{pageTitle}</h2>

            <div className="controls-right">
                <label className="control-select">
                    <span className="control-select-label">Season</span>
                    <select
                        value={seasonOption ?? ""}
                        onChange={(event) => setSeasonOption(event.target.value)}
                        disabled={seasons.length === 0}
                    >
                        {seasons.map((season) => (
                            <option key={season} value={season}>{season}</option>
                        ))}
                    </select>
                </label>

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
                        <option value="zip">Zip code</option>
                        <option value="homeowner">Homeowner</option>
                    </select>
                </label>

                <SearchBar setSearchTerm={setSearchTerm} />
            </div>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {!loaded && !error && <Loading />}

        {loaded && orders.length === 0 && (
            <div className="empty-state">
                <SproutIcon size={28} />
                <p className="empty-state-message">{emptyMessage(statusFilter)}</p>
            </div>
        )}

        {loaded && orders.length > 0 && filteredOrders.length === 0 && (
            <div className="empty-state">
                <p className="empty-state-message">No orders match your search and filters.</p>
            </div>
        )}

        <div className="order-list">
            {filteredOrders.map((orderObj) => (
                <Order key={orderObj.id} order={orderObj} />
            ))}
        </div>
    </div>
)}
