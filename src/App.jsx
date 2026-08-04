import "./index.css"
import {Routes, Outlet, Route } from "react-router-dom"
import { NavBar } from "./components/Nav/NavBar"
import { AllOrders } from "./components/Orders/AllOrders"
import { OrderDetails } from "./components/Orders/orderDetails"
import { Sales } from "./components/Orders/Sales"

export const App = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <>
            <NavBar/>
            <Outlet/>
          </>
        }
      >
        <Route index element={<AllOrders pageTitle="All Orders" />} />
        <Route path="pending" element={<AllOrders statusFilter="PENDING" pageTitle="Pending Orders" />} />
        <Route path="fulfilled" element={<AllOrders statusFilter="FULFILLED" pageTitle="Fulfilled Orders" />} />
        <Route path="order/:orderId" element={<OrderDetails />} />
        <Route path="sales" element={<Sales />} />
      </Route>
    </Routes>
    )
  }
