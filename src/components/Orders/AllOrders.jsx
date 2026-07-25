import "./Orders.css"
import {useState, useEffect } from "react"
import React from "react"
import { getAllOrders } from "../../services/orderServices"
import { SearchBar } from "./SearchBar"
import { Order } from "./Order"

export const AllOrders = () => {
    const [orders, setOrders] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredOrders, setFilteredOrders] = useState([])

    useEffect(() => {
        getAllOrders().then((orderArray) => {
            console.log("Orders received:", orderArray)
            setOrders(orderArray)
        })
    }, [])

    useEffect(() => {
        let filtered = orders

        if(searchTerm !== "") {
            filtered = filtered.filter(order =>
                order.customerName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        }

        setFilteredOrders(filtered)
    }, [orders, searchTerm])

    return (
        <div className="app-container">
            <h1 className="page-title">Tree Sale</h1>
            <div>
                <h2 className="page-header">All Orders</h2>

                <div className="search-bar">
                    <SearchBar
                    setSearchTerm=
                    {setSearchTerm}/>
                </div>

                <div className="order-grid">
                    {filteredOrders.map
                    ((orderObj) => (
                        <Order key={orderObj.id}
                        order={orderObj} />
                    ))}
                </div>
            </div>
        </div>
    )
}